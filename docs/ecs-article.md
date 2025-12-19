---
title: "Deploying Applications on Amazon ECS: A Practical Guide"
published: true
description: "Learn how to deploy containerized applications on Amazon ECS with Fargate. A hands-on guide using a real full-stack application."
tags: [aws, ecs, docker, devops]
cover_image: https://raw.githubusercontent.com/bansikah22/cloudnotes/main/docs/cloudnotes.png
canonical_url: 
series: "AWS Container Services"
---

# Deploying Applications on Amazon ECS: A Practical Guide

## Introduction

In this article, I will walk you through deploying a containerized application on **Amazon ECS (Elastic Container Service)** using AWS Fargate. We will use a real full-stack application called **CloudNotes** that has already been developed and dockerized.

Our focus will be entirely on ECS concepts, the deployment process, and understanding the Terraform infrastructure code. By the end of this article, you will have a clear understanding of how ECS works and how to deploy your own containerized applications on AWS.

**Repository**: [github.com/bansikah22/cloudnotes](https://github.com/bansikah22/cloudnotes)

---

## What Is Amazon ECS?

Amazon ECS (Elastic Container Service) is a fully managed container orchestration service provided by AWS. It manages how your Docker containers are defined, deployed, scaled, and maintained.

ECS handles the complexity of running containers at scale while integrating deeply with other AWS services like IAM, CloudWatch, VPC, and Application Load Balancers.

---

## ECS Core Concepts

Understanding ECS requires grasping its main objects and how they relate to each other:

**Cluster -> Service -> Task Definition -> Tasks -> Containers**

### Cluster

An ECS Cluster is a logical grouping of tasks or services. It serves as the foundation where your container workloads run. You can think of it as a namespace that organizes your services.

### Task Definition

A Task Definition is a blueprint that describes how containers should be deployed. It is unique to ECS and defines:

- How much CPU and memory a container will use
- The container image to pull
- Port mappings
- Environment variables
- Volumes and other runtime settings

Essentially, a Task Definition contains the same configuration you would normally place in a `docker-compose.yml` file.

**Important Note**: Port mapping in ECS (especially with `awsvpc` network mode on Fargate) must map the same port to the same port (e.g., `3000:3000`). Mappings like `3000:3001` will not work because ECS does not allow arbitrary host-to-container remapping in this mode.

### Task

A Task is an instance of a Task Definition. It represents a running copy of your application. The Task contains one or more running containers defined by the Task Definition.

### Service

An ECS Service ensures that a specified number of Tasks are running at all times. It provides:

- Automatic restart of tasks if they crash or exit
- Rescheduling of tasks on healthy instances if an EC2 instance fails (in EC2 mode)
- Integration with load balancers to distribute traffic across tasks

### ECS Load Balancers

An Application Load Balancer (ALB) can be assigned to an ECS Service. It routes external traffic to tasks through a Target Group. The ECS service automatically registers and deregisters tasks to the Target Group as they start and stop.

### Launch Types: Fargate vs EC2

ECS offers two launch types:

| Launch Type | Description | Best For |
|-------------|-------------|----------|
| Fargate | Serverless - AWS manages the underlying infrastructure | Most workloads, simpler operations |
| EC2 | You manage the EC2 instances that host your containers | GPU workloads, specific instance requirements |

For this guide, we use Fargate because it eliminates server management, you pay only for resources used, and it handles infrastructure scaling automatically.

---

## The CloudNotes Application

The application we are deploying is a full-stack ToDo Notes application. It has already been developed and dockerized, so our focus remains on the ECS deployment.

**Tech Stack**:
- Frontend: React, Vite, TypeScript, served via Nginx
- Backend: Node.js, Express, TypeScript
- Infrastructure: Terraform, AWS ECS Fargate

The Docker images are available on Docker Hub:
- `bansikah/cloudnotes-frontend:latest`
- `bansikah/cloudnotes-backend:latest`

---

## Getting Started

To follow along with this guide, clone the repository and explore the infrastructure code:

```bash
git clone https://github.com/bansikah22/cloudnotes.git
cd cloudnotes
```

### Prerequisites

Before deploying, ensure you have:

1. AWS CLI installed and configured with appropriate credentials (`aws configure`)
2. Terraform v1.0+ installed
3. Docker installed (for local testing if needed)

---

## Understanding the Terraform Infrastructure

The infrastructure code is located in the `infrastructure/` directory. Let me walk you through the key components.

### VPC Configuration

We use the terraform-aws-modules VPC module to create a network with public and private subnets across two availability zones:

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "cloudnotes-vpc"
  cidr = "10.0.0.0/16"

  azs             = slice(data.aws_availability_zones.available.names, 0, 2)
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}
```

The ALB sits in public subnets while ECS tasks run in private subnets, accessing the internet through the NAT Gateway.

### ECS Cluster

The cluster is simply a logical grouping:

```hcl
resource "aws_ecs_cluster" "cloudnotes" {
  name = "cloudnotes-cluster"
}
```

### Task Definitions

Here is the backend task definition showing how we define container configurations:

```hcl
resource "aws_ecs_task_definition" "backend" {
  family                   = "cloudnotes-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.backend_cpu
  memory                   = var.backend_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  container_definitions    = jsonencode(local.backend_container)
}
```

The container definition includes the image, port mappings, environment variables, and logging configuration:

```hcl
backend_container = [
  {
    name      = "backend"
    image     = var.backend_image
    essential = true
    portMappings = [
      {
        containerPort = 5000
        hostPort      = 5000
        protocol      = "tcp"
      }
    ]
    environment = [
      {
        name  = "NODE_ENV"
        value = "production"
      }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.backend.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "backend"
      }
    }
  }
]
```

### ECS Services

The service ensures our tasks are always running and connects them to the load balancer:

```hcl
resource "aws_ecs_service" "backend" {
  name            = "cloudnotes-backend"
  cluster         = aws_ecs_cluster.cloudnotes.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = module.vpc.private_subnets
    security_groups = [aws_security_group.backend.id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 5000
  }

  health_check_grace_period_seconds = 60

  depends_on = [aws_lb_listener_rule.api_path]
}
```

### Application Load Balancer with Path-Based Routing

The ALB distributes traffic between frontend and backend services using path-based routing:

```hcl
resource "aws_lb" "cloudnotes" {
  name               = "cloudnotes-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.cloudnotes.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

resource "aws_lb_listener_rule" "api_path" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}
```

This routes all `/api/*` requests to the backend service and everything else to the frontend.

### Security Groups

The security groups control network access:

- ALB security group allows inbound HTTP/HTTPS from the internet
- Frontend security group allows traffic only from the ALB on port 80
- Backend security group allows traffic only from the ALB on port 5000

```hcl
resource "aws_security_group" "backend" {
  name        = "cloudnotes-backend-sg"
  description = "Allow only ALB to access backend"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### IAM Roles

Two IAM roles are created:

1. **Task Execution Role**: Allows ECS to pull images and write logs to CloudWatch
2. **Task Role**: Grants permissions to the running application itself

---

## Deploying the Infrastructure

Navigate to the infrastructure directory and run:

```bash
cd infrastructure

# Initialize Terraform
terraform init

# Validate the configuration
terraform validate

# Review the execution plan
terraform plan

# Deploy the infrastructure
terraform apply
```

Type `yes` when prompted to confirm the deployment.

---

## Observing the Deployed Application

Once the deployment completes, Terraform outputs the ALB DNS name. You can access your application using this URL.

### ECS Cluster

The cluster dashboard shows your services and their status:

![ECS Cluster](https://raw.githubusercontent.com/bansikah22/cloudnotes/main/docs/images/cluster.png)

### Running Services

Both frontend and backend services are running with their desired task counts:

![ECS Services](https://raw.githubusercontent.com/bansikah22/cloudnotes/main/docs/images/services.png)

### Task Definition

The task definition view shows container configurations, resource allocations, and logging settings:

![Task Definition](https://raw.githubusercontent.com/bansikah22/cloudnotes/main/docs/images/task-definition.png)

### The Running Application

Access the application via the ALB DNS name to see CloudNotes in action:

![Deployed App](https://raw.githubusercontent.com/bansikah22/cloudnotes/main/docs/images/deployed-app.png)

---

## Architecture

The architecture follows a standard pattern for containerized applications on AWS:

- Users access the application through the Application Load Balancer
- The ALB sits in public subnets and routes traffic based on URL paths
- Frontend requests go to the frontend ECS service
- API requests (`/api/*`) go to the backend ECS service
- Both services run as Fargate tasks in private subnets
- Tasks pull images from Docker Hub and send logs to CloudWatch
- A NAT Gateway enables outbound internet access for the private subnets

<!-- Architecture diagram will be added here -->

---

## Clean Up

To avoid ongoing AWS charges, destroy the infrastructure when you are done:

```bash
terraform destroy --auto-approve
```

---

## Summary

In this article, we covered:

- What Amazon ECS is and its core components (Cluster, Service, Task Definition, Task)
- How traffic flows from users through the ALB to ECS services
- The Terraform code that provisions the entire infrastructure
- How to deploy and observe a running application on ECS Fargate

ECS provides a straightforward way to run containers on AWS without managing the underlying infrastructure. With Fargate, you can focus entirely on your application while AWS handles server provisioning, scaling, and maintenance.

---

## What is Next

In upcoming articles, we will explore:

- ECS vs EKS: A detailed comparison to help you choose the right service
- CI/CD pipelines for ECS with GitHub Actions
- Auto-scaling ECS services based on metrics
- Adding HTTPS with AWS Certificate Manager

---

## Resources

- Repository: [github.com/bansikah22/cloudnotes](https://github.com/bansikah22/cloudnotes)
- AWS ECS Documentation: [docs.aws.amazon.com/ecs](https://docs.aws.amazon.com/ecs/)
- Terraform AWS Provider: [registry.terraform.io/providers/hashicorp/aws](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

---

If you have questions or feedback, feel free to drop a comment below. If you found this helpful, consider following for more AWS and DevOps content.


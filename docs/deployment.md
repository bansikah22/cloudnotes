# Infrastructure Deployment Guide

This guide details the steps to deploy the CloudNotes application to AWS using Terraform.

## Prerequisites

1.  **AWS CLI**: Installed and configured with appropriate credentials (`aws configure`).
2.  **Terraform**: Installed (v1.0+).
3.  **Docker**: Installed and running.
4.  **Docker Hub Account**: You need a Docker Hub account to push the images.

## 1. Build and Push Docker Images

Before deploying the infrastructure, the Docker images must be available in a registry (Docker Hub).

### Backend

```bash
cd backend
docker build -t <your-dockerhub-username>/cloudnotes-backend:latest .
docker push <your-dockerhub-username>/cloudnotes-backend:latest
```

### Frontend

```bash
cd frontend
docker build -t <your-dockerhub-username>/cloudnotes-frontend:latest .
docker push <your-dockerhub-username>/cloudnotes-frontend:latest
```

> **Note:** Replace `<your-dockerhub-username>` with your actual Docker Hub username. The default configuration uses `bansikah`.

## 2. Deploy Infrastructure with Terraform

Navigate to the infrastructure directory:

```bash
cd infrastructure
```

### Initialize Terraform

Initialize the working directory containing Terraform configuration files. This is the first command that should be run after writing a new Terraform configuration or cloning an existing one.

```bash
terraform init
```

### Validate Configuration

Verify that the configuration files are syntactically valid and internally consistent.

```bash
terraform validate
```

### Plan Deployment

Create an execution plan. Terraform performs a refresh, unless explicitly disabled, and then determines what actions are necessary to achieve the desired state specified in the configuration files.

```bash
terraform plan
```

### Apply Changes

Apply the changes required to reach the desired state of the configuration.

```bash
terraform apply
```

Type `yes` when prompted to confirm the deployment.

## 3. Access the Application

Once the deployment is complete, Terraform will output the DNS name of the Application Load Balancer (ALB).

Example output:
```
alb_dns_name = "cloudnotes-alb-123456789.us-east-1.elb.amazonaws.com"
```

Open this URL in your browser to access the CloudNotes application.

## 4. Clean Up (Destroy Infrastructure)

To remove all resources created by Terraform:

```bash
terraform destroy
```

Type `yes` when prompted.

## Architecture Overview

-   **VPC**: A custom VPC with public and private subnets across two Availability Zones.
-   **ECS Cluster**: An Amazon ECS cluster to manage the services.
-   **Fargate**: Serverless compute engine for containers.
-   **Application Load Balancer (ALB)**: Distributes incoming traffic to the frontend service and routes `/api/*` requests to the backend service.
-   **CloudWatch Logs**: Centralized logging for both frontend and backend services.

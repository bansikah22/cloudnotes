# Infrastructure: Terraform for ECS Fargate (starter)

This folder contains a starter Terraform scaffold for deploying the CloudNotes frontend and backend to AWS ECS Fargate.

What is included:
- `main.tf` - provider, VPC module, ECS cluster, ALB, security groups, IAM roles, task definitions (starter)
- `variables.tf` - configurable variables (region, images, cpu/memory, counts)
- `outputs.tf` - useful outputs (ALB DNS, cluster name)

Quick start (locally):

1. Install Terraform (>= 1.0)
2. Configure AWS credentials in env or `~/.aws/credentials`:

```bash
export AWS_PROFILE=your-profile
export AWS_REGION=us-east-1
```

3. Edit `terraform.tfvars` or pass variables at apply time. At minimum set `frontend_image` and `backend_image` to your Docker Hub images.

4. Initialize and apply:

```bash
cd infrastructure
terraform init
terraform plan -out plan.tfplan
terraform apply plan.tfplan
```

Notes:
- This is a starter scaffold using community modules for the VPC. You should review module versions and tune sizing, IAM policies and security before using in production.
- The scaffold expects images in Docker Hub (or any public registry). Replace with your image URIs.

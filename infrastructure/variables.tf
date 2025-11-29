variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "frontend_image" {
  description = "Docker image URI for the frontend (e.g., dockerhubuser/frontend:tag)"
  type        = string
  default     = "bansikah/cloudnotes-frontend:latest"
}

variable "backend_image" {
  description = "Docker image URI for the backend (e.g., dockerhubuser/backend:tag)"
  type        = string
  default = "bansikah/cloudnotes-backend:latest"
}

variable "desired_count" {
  description = "Desired task count for each service"
  type        = number
  default     = 1
}

variable "frontend_cpu" {
  description = "CPU units for frontend tasks (256, 512, 1024, etc.)"
  type        = string
  default     = "256"
}
variable "frontend_memory" {
  description = "Memory (MB) for frontend tasks (512, 1024, 2048, etc.)"
  type        = string
  default     = "512"
}
variable "backend_cpu" {
  description = "CPU units for backend tasks (256, 512, 1024, etc.)"
  type        = string
  default     = "256"
}
variable "backend_memory" {
  description = "Memory (MB) for backend tasks (512, 1024, 2048, etc.)"
  type        = string
  default     = "512"
}
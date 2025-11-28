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
  type    = string
  default = "256"
}

variable "frontend_memory" {
  type    = string
  default = "512"
}

variable "backend_cpu" {
  type    = string
  default = "256"
}

variable "backend_memory" {
  type    = string
  default = "512"
}

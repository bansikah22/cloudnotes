output "cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.cloudnotes.name
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.cloudnotes.dns_name
}

output "frontend_service_name" {
  description = "Frontend ECS service name"
  value       = aws_ecs_service.frontend.name
}

output "backend_service_name" {
  description = "Backend ECS service name"
  value       = aws_ecs_service.backend.name
}

variable "namespace_name" {
  type        = string
  default     = "sourceloop-sandbox"
  description = "Namespace name"
}

variable "auth_multitenant_ms_microservice_image" {
  default     = "sourcefuse/auth-multitenant-example"
  description = "Image version for the auth-multitenant-ms"
  type        = string
}

variable "notification_ms_microservice_image" {
  default     = "sourcefuse/notification-socket-example"
  description = "Image version for the notification-ms"
  type        = string
}

variable "audit_ms_microservice_image" {
  default     = "sourcefuse/audit-ms-example"
  description = "Image version for the audit-ms"
  type        = string
}

variable "workflow_ms_microservice_image" {
  default     = "sourcefuse/workflow-ms-example"
  description = "Image version for the workflow-ms"
  type        = string
}

variable "scheduler_ms_microservice_image" {
  default     = "sourcefuse/scheduler-example"
  description = "Image version for the scheduler-ms"
  type        = string
}

variable "video_ms_microservice_image" {
  default     = "sourcefuse/video-conferencing-ms-example"
  description = "Image version for the video-ms"
  type        = string
}

variable "in_mail_ms_microservice_image" {
  default     = "sourcefuse/in-mail-example"
  description = "Image version for the in-mail-ms"
  type        = string
}

variable "redis_image" {
  default     = "redis"
  description = "Image version for Redis"
  type        = string
}

variable "nginx_image" {
  default     = "nginx:alpine"
  description = "Image version for Nginx"
  type        = string
}

variable "camunda_image" {
  default     = "camunda/camunda-bpm-platform:run-latest"
  description = "Image version for Camunda"
  type        = string
}

variable "postgres_image" {
  default     = "postgres"
  description = "Image version for PostgreSQL"
  type        = string
}

variable "pgadmin_image" {
  default     = "dpage/pgadmin4"
  description = "Image version for pgAdmin"
  type        = string
}

variable "service_name" {
  type        = string
  description = "Name of the k8s service"
}

variable "namespace_name" {
  type        = string
  description = "Name of the k8s namespace"
}

variable "app_label" {
  type        = string
  description = "Value for the app label used for label matching"
}

variable "port_name" {
  type        = string
  description = "Name of the service port"
}

variable "port" {
  type        = number
  description = "k8s service port"
}

variable "target_port" {
  type        = number
  description = "k8s service target port"
}

variable "protocol" {
  type        = string
  description = "k8s service protocol"
}

variable "deployment_name" {
  type        = string
  description = "Name of the k8s deployment"
}

variable "container_name" {
  type        = string
  description = "Name of container for the k8s deployment"
}

variable "container_image" {
  type        = string
  description = "Docker image for the k8s deployment"
}

variable "container_port" {
  type        = number
  description = "Container port for the k8s deployment"
}

variable "replica_count" {
  type        = number
  description = "k8s Deployment replica count"
}

variable "environment_variables" {
  description = "List of maps for environment variables"
  type        = list(object({ name = string, value = string }))
  default     = []
}

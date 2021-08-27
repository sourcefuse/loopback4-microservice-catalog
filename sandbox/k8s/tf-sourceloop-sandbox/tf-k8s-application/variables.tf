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

####################################################
## persistent volume and claims
####################################################
## pv
variable "persistent_volume_annotations" {
  description = "An unstructured key value map stored with the persistent volume that may be used to store arbitrary metadata."
  type        = map(any)
  default     = {}
}

variable "persistent_volume_access_modes" {
  description = "Contains all ways the volume can be mounted. Valid values are ReadWriteOnce, ReadOnlyMany, ReadWriteMany."
  type        = list(string)
  default     = ["ReadWriteMany"]
}

variable "persistent_volume_enable" {
  description = "Enable a persistent volume."
  type        = bool
  default     = false
}

variable "persistent_volume_labels" {
  description = "Map of string keys and values that can be used to organize and categorize (scope and select) the persistent volume. May match selectors of replication controllers and services."
  type        = map(any)
  default     = {}
}

variable "persistent_volume_name" {
  description = "Name of the persistent volume, must be unique. Cannot be updated."
  default     = null
}

variable "persistent_volume_reclaim_policy" {
  description = "What happens to a persistent volume when released from its claim. Valid options are Retain (default), Delete and Recycle. Recycling must be supported by the volume plugin underlying this persistent volume."
  default     = "Delete"
}

variable "persistent_volume_storage_path" {
  description = "Path of the directory on the host."
  default     = null
}

variable "persistent_volume_storage_size" {
  description = "Persistent volume size."
  default     = "1Gi"
}

## pvc
variable "persistent_volume_claim_access_modes" {
  description = "A set of the desired access modes the volume should have."
  type        = list(string)
  default     = ["ReadWriteMany"]
}

variable "persistent_volume_claim_annotations" {
  description = "An unstructured key value map stored with the persistent volume claim that may be used to store arbitrary metadata."
  type        = map(any)
  default     = {}
}

variable "persistent_volume_claim_enable" {
  description = "Enable a persistent volume claim."
  type        = bool
  default     = false
}

variable "persistent_volume_claim_labels" {
  description = "Map of string keys and values that can be used to organize and categorize (scope and select) the persistent volume claim. May match selectors of replication controllers and services."
  type        = map(any)
  default     = {}
}

variable "persistent_volume_claim_name" {
  description = "Name of the persistent volume claim, must be unique. Cannot be updated."
  default     = null
}

variable "persistent_volume_claim_namespace" {
  description = "Namespace defines the space within which name of the persistent volume claim must be unique."
  default     = null
}

variable "persistent_volume_claim_volume_name" {
  description = "The binding reference to the PersistentVolume backing this claim."
  default     = null
}

variable "persistent_volume_claim_resource_limits" {
  description = "Map describing the maximum amount of compute resources allowed."
  type        = map(string)
  default     = {}
}

variable "persistent_volume_claim_resource_request" {
  description = "Map describing the minimum amount of compute resources required."
  type        = map(string)

  default = {
    storage = "5Gi"
  }
}

variable "persistent_volume_claim_storage_class_name" {
  description = "Name of the storage class requested by the claim."
  default     = null
}

variable "persistent_volume_claim_storage_size" {
  description = "Map describing the minimum amount of compute resources required."
  default     = null
}

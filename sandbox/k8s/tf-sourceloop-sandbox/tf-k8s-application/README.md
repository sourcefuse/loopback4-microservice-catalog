# TF K8s Application

## Providers

| Name | Version |
|------|---------|
| <a name="provider_kubernetes"></a> [kubernetes](#provider\_kubernetes) | n/a |

## Resources

| Name | Type |
|------|------|
| [kubernetes_deployment.default](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/deployment) | resource |
| [kubernetes_persistent_volume.default](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/persistent_volume) | resource |
| [kubernetes_persistent_volume_claim.default](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/persistent_volume_claim) | resource |
| [kubernetes_service.default](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/service) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_app_label"></a> [app\_label](#input\_app\_label) | Value for the app label used for label matching | `string` | n/a | yes |
| <a name="input_container_image"></a> [container\_image](#input\_container\_image) | Docker image for the k8s deployment | `string` | n/a | yes |
| <a name="input_container_name"></a> [container\_name](#input\_container\_name) | Name of container for the k8s deployment | `string` | n/a | yes |
| <a name="input_container_port"></a> [container\_port](#input\_container\_port) | Container port for the k8s deployment | `number` | n/a | yes |
| <a name="input_deployment_name"></a> [deployment\_name](#input\_deployment\_name) | Name of the k8s deployment | `string` | n/a | yes |
| <a name="input_environment_variables"></a> [environment\_variables](#input\_environment\_variables) | List of maps for environment variables | `list(object({ name = string, value = string }))` | `[]` | no |
| <a name="input_namespace_name"></a> [namespace\_name](#input\_namespace\_name) | Name of the k8s namespace | `string` | n/a | yes |
| <a name="input_persistent_volume_access_modes"></a> [persistent\_volume\_access\_modes](#input\_persistent\_volume\_access\_modes) | Contains all ways the volume can be mounted. Valid values are ReadWriteOnce, ReadOnlyMany, ReadWriteMany. | `list(string)` | <pre>[<br>  "ReadWriteMany"<br>]</pre> | no |
| <a name="input_persistent_volume_annotations"></a> [persistent\_volume\_annotations](#input\_persistent\_volume\_annotations) | An unstructured key value map stored with the persistent volume that may be used to store arbitrary metadata. | `map(any)` | `{}` | no |
| <a name="input_persistent_volume_claim_access_modes"></a> [persistent\_volume\_claim\_access\_modes](#input\_persistent\_volume\_claim\_access\_modes) | A set of the desired access modes the volume should have. | `list(string)` | <pre>[<br>  "ReadWriteMany"<br>]</pre> | no |
| <a name="input_persistent_volume_claim_annotations"></a> [persistent\_volume\_claim\_annotations](#input\_persistent\_volume\_claim\_annotations) | An unstructured key value map stored with the persistent volume claim that may be used to store arbitrary metadata. | `map(any)` | `{}` | no |
| <a name="input_persistent_volume_claim_enable"></a> [persistent\_volume\_claim\_enable](#input\_persistent\_volume\_claim\_enable) | Enable a persistent volume claim. | `bool` | `false` | no |
| <a name="input_persistent_volume_claim_labels"></a> [persistent\_volume\_claim\_labels](#input\_persistent\_volume\_claim\_labels) | Map of string keys and values that can be used to organize and categorize (scope and select) the persistent volume claim. May match selectors of replication controllers and services. | `map(any)` | `{}` | no |
| <a name="input_persistent_volume_claim_name"></a> [persistent\_volume\_claim\_name](#input\_persistent\_volume\_claim\_name) | Name of the persistent volume claim, must be unique. Cannot be updated. | `any` | `null` | no |
| <a name="input_persistent_volume_claim_namespace"></a> [persistent\_volume\_claim\_namespace](#input\_persistent\_volume\_claim\_namespace) | Namespace defines the space within which name of the persistent volume claim must be unique. | `any` | `null` | no |
| <a name="input_persistent_volume_claim_resource_limits"></a> [persistent\_volume\_claim\_resource\_limits](#input\_persistent\_volume\_claim\_resource\_limits) | Map describing the maximum amount of compute resources allowed. | `map(string)` | `{}` | no |
| <a name="input_persistent_volume_claim_resource_request"></a> [persistent\_volume\_claim\_resource\_request](#input\_persistent\_volume\_claim\_resource\_request) | Map describing the minimum amount of compute resources required. | `map(string)` | <pre>{<br>  "storage": "5Gi"<br>}</pre> | no |
| <a name="input_persistent_volume_claim_storage_class_name"></a> [persistent\_volume\_claim\_storage\_class\_name](#input\_persistent\_volume\_claim\_storage\_class\_name) | Name of the storage class requested by the claim. | `any` | `null` | no |
| <a name="input_persistent_volume_claim_storage_size"></a> [persistent\_volume\_claim\_storage\_size](#input\_persistent\_volume\_claim\_storage\_size) | Map describing the minimum amount of compute resources required. | `any` | `null` | no |
| <a name="input_persistent_volume_claim_volume_name"></a> [persistent\_volume\_claim\_volume\_name](#input\_persistent\_volume\_claim\_volume\_name) | The binding reference to the PersistentVolume backing this claim. | `any` | `null` | no |
| <a name="input_persistent_volume_enable"></a> [persistent\_volume\_enable](#input\_persistent\_volume\_enable) | Enable a persistent volume. | `bool` | `false` | no |
| <a name="input_persistent_volume_labels"></a> [persistent\_volume\_labels](#input\_persistent\_volume\_labels) | Map of string keys and values that can be used to organize and categorize (scope and select) the persistent volume. May match selectors of replication controllers and services. | `map(any)` | `{}` | no |
| <a name="input_persistent_volume_name"></a> [persistent\_volume\_name](#input\_persistent\_volume\_name) | Name of the persistent volume, must be unique. Cannot be updated. | `any` | `null` | no |
| <a name="input_persistent_volume_reclaim_policy"></a> [persistent\_volume\_reclaim\_policy](#input\_persistent\_volume\_reclaim\_policy) | What happens to a persistent volume when released from its claim. Valid options are Retain (default), Delete and Recycle. Recycling must be supported by the volume plugin underlying this persistent volume. | `string` | `"Delete"` | no |
| <a name="input_persistent_volume_storage_path"></a> [persistent\_volume\_storage\_path](#input\_persistent\_volume\_storage\_path) | Path of the directory on the host. | `any` | `null` | no |
| <a name="input_persistent_volume_storage_size"></a> [persistent\_volume\_storage\_size](#input\_persistent\_volume\_storage\_size) | Persistent volume size. | `string` | `"1Gi"` | no |
| <a name="input_port"></a> [port](#input\_port) | k8s service port | `number` | n/a | yes |
| <a name="input_port_name"></a> [port\_name](#input\_port\_name) | Name of the service port | `string` | n/a | yes |
| <a name="input_protocol"></a> [protocol](#input\_protocol) | k8s service protocol | `string` | n/a | yes |
| <a name="input_replica_count"></a> [replica\_count](#input\_replica\_count) | k8s Deployment replica count | `number` | n/a | yes |
| <a name="input_service_name"></a> [service\_name](#input\_service\_name) | Name of the k8s service | `string` | n/a | yes |
| <a name="input_target_port"></a> [target\_port](#input\_target\_port) | k8s service target port | `number` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_host"></a> [host](#output\_host) | n/a |
| <a name="output_service_name"></a> [service\_name](#output\_service\_name) | n/a |
| <a name="output_service_port"></a> [service\_port](#output\_service\_port) | n/a |

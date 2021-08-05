# tf-sourceloop-sandbox

## Overview

k8s managed by Terraform for the `Sourceloop` sandbox.

## Usage

```hcl
module "tf-sourceloop-sandbox" {
  source = "git::ssh://"
}
```

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.3 |
| <a name="requirement_kubectl"></a> [kubectl](#requirement\_kubectl) | >= 1.7.0 |
| <a name="requirement_kubernetes"></a> [kubernetes](#requirement\_kubernetes) | >= 2.0 |
| <a name="requirement_null"></a> [null](#requirement\_null) | 3.1.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_kubectl"></a> [kubectl](#provider\_kubectl) | 1.11.2 |
| <a name="provider_kubernetes"></a> [kubernetes](#provider\_kubernetes) | 2.3.2 |
| <a name="provider_template"></a> [template](#provider\_template) | 2.2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_sandbox_applications"></a> [sandbox\_applications](#module\_sandbox\_applications) | ./tf-k8s-application | n/a |

## Resources

| Name | Type |
|------|------|
| [kubectl_manifest.audit_ms_migrations](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.auth_multitenant_ms_migrations](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.pgadmin_manifests](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.postgres_manifests](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.sandbox_ingress](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.video_conferencing_migrations](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.workflow_migrations](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubernetes_namespace.sourceloop_sandbox](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/namespace) | resource |
| [template_file.ingress_init](https://registry.terraform.io/providers/hashicorp/template/latest/docs/data-sources/file) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_audit_ms_microservice_image"></a> [audit\_ms\_microservice\_image](#input\_audit\_ms\_microservice\_image) | Image version for the audit-ms | `string` | `"sourcefuse/audit-ms-example"` | no |
| <a name="input_auth_multitenant_ms_microservice_image"></a> [auth\_multitenant\_ms\_microservice\_image](#input\_auth\_multitenant\_ms\_microservice\_image) | Image version for the auth-multitenant-ms | `string` | `"sourcefuse/auth-multitenant-example"` | no |
| <a name="input_camunda_image"></a> [camunda\_image](#input\_camunda\_image) | Image version for Camunda | `string` | `"camunda/camunda-bpm-platform:run-latest"` | no |
| <a name="input_in_mail_ms_microservice_image"></a> [in\_mail\_ms\_microservice\_image](#input\_in\_mail\_ms\_microservice\_image) | Image version for the in-mail-ms | `string` | `"sourcefuse/in-mail-example"` | no |
| <a name="input_namespace_name"></a> [namespace\_name](#input\_namespace\_name) | Namespace name | `string` | `"sourceloop-sandbox"` | no |
| <a name="input_nginx_image"></a> [nginx\_image](#input\_nginx\_image) | Image version for Nginx | `string` | `"nginx:alpine"` | no |
| <a name="input_notification_ms_microservice_image"></a> [notification\_ms\_microservice\_image](#input\_notification\_ms\_microservice\_image) | Image version for the notification-ms | `string` | `"sourcefuse/notification-socket-example"` | no |
| <a name="input_pgadmin_image"></a> [pgadmin\_image](#input\_pgadmin\_image) | Image version for pgAdmin | `string` | `"dpage/pgadmin4"` | no |
| <a name="input_postgres_image"></a> [postgres\_image](#input\_postgres\_image) | Image version for PostgreSQL | `string` | `"postgres"` | no |
| <a name="input_redis_image"></a> [redis\_image](#input\_redis\_image) | Image version for Redis | `string` | `"redis"` | no |
| <a name="input_scheduler_ms_microservice_image"></a> [scheduler\_ms\_microservice\_image](#input\_scheduler\_ms\_microservice\_image) | Image version for the scheduler-ms | `string` | `"sourcefuse/scheduler-example"` | no |
| <a name="input_video_ms_microservice_image"></a> [video\_ms\_microservice\_image](#input\_video\_ms\_microservice\_image) | Image version for the video-ms | `string` | `"sourcefuse/video-conferencing-ms-example"` | no |
| <a name="input_workflow_ms_microservice_image"></a> [workflow\_ms\_microservice\_image](#input\_workflow\_ms\_microservice\_image) | Image version for the workflow-ms | `string` | `"sourcefuse/workflow-ms-example"` | no |

## Outputs

No outputs.
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->

## Development

### Prerequisites

- [terraform](https://learn.hashicorp.com/terraform/getting-started/install#installing-terraform)
- [terraform-docs](https://github.com/segmentio/terraform-docs)
- [pre-commit](https://pre-commit.com/#install)
- [golang](https://golang.org/doc/install#install)
- [golint](https://github.com/golang/lint#installation)

### Configurations

- Configure pre-commit hooks
```sh
pre-commit install
```


- Configure golang deps for tests
```sh
> go get github.com/gruntwork-io/terratest/modules/terraform
> go get github.com/stretchr/testify/assert
```



### Tests

- Tests are available in `test` directory

- In the test directory, run the below command
```sh
go test
```



## Authors
 - SourceFuse

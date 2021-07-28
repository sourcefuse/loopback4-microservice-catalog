# tf-sourceloop-sandbox

## Overview

k8s managed by Terraform for the `Sourceloop` sandbox.

## Usage

```hcl
module "tf-sourceloop-sandbox" {
  source = "git::ssh://"
}
```

## Requirements

| Name                                                                        | Version  |
| --------------------------------------------------------------------------- | -------- |
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform)    | >= 1.0.3 |
| <a name="requirement_kubectl"></a> [kubectl](#requirement_kubectl)          | >= 1.7.0 |
| <a name="requirement_kubernetes"></a> [kubernetes](#requirement_kubernetes) | >= 2.0   |
| <a name="requirement_null"></a> [null](#requirement_null)                   | 3.1.0    |

## Providers

| Name                                                                  | Version |
| --------------------------------------------------------------------- | ------- |
| <a name="provider_kubectl"></a> [kubectl](#provider_kubectl)          | 1.11.2  |
| <a name="provider_kubernetes"></a> [kubernetes](#provider_kubernetes) | 2.3.2   |
| <a name="provider_template"></a> [template](#provider_template)       | 2.2.0   |

## Modules

| Name                                                                                            | Source               | Version |
| ----------------------------------------------------------------------------------------------- | -------------------- | ------- |
| <a name="module_sandbox_applications"></a> [sandbox_applications](#module_sandbox_applications) | ./tf-k8s-application | n/a     |

## Resources

| Name                                                                                                                                          | Type        |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [kubectl_manifest.audit_ms_migrations](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest)            | resource    |
| [kubectl_manifest.auth_multitenant_ms_migrations](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource    |
| [kubectl_manifest.pgadmin_manifests](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest)              | resource    |
| [kubectl_manifest.postgres_manifests](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest)             | resource    |
| [kubectl_manifest.sandbox_ingress](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest)                | resource    |
| [kubectl_manifest.video_conferencing_migrations](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest)  | resource    |
| [kubectl_manifest.workflow_migrations](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest)            | resource    |
| [kubernetes_namespace.sourceloop_sandbox](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/namespace)       | resource    |
| [template_file.ingress_init](https://registry.terraform.io/providers/hashicorp/template/latest/docs/data-sources/file)                        | data source |

## Inputs

| Name                                                                                                                                                | Description                               | Type     | Default                                      | Required |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------- | -------------------------------------------- | :------: |
| <a name="input_audit_ms_microservice_image"></a> [audit_ms_microservice_image](#input_audit_ms_microservice_image)                                  | Image version for the audit-ms            | `string` | `"sourcefuse/audit-ms-example"`              |    no    |
| <a name="input_auth_multitenant_ms_microservice_image"></a> [auth_multitenant_ms_microservice_image](#input_auth_multitenant_ms_microservice_image) | Image version for the auth-multitenant-ms | `string` | `"sourcefuse/auth-multitenant-example"`      |    no    |
| <a name="input_camunda_image"></a> [camunda_image](#input_camunda_image)                                                                            | Image version for Camunda                 | `string` | `"camunda/camunda-bpm-platform:run-latest"`  |    no    |
| <a name="input_in_mail_ms_microservice_image"></a> [in_mail_ms_microservice_image](#input_in_mail_ms_microservice_image)                            | Image version for the in-mail-ms          | `string` | `"sourcefuse/in-mail-example"`               |    no    |
| <a name="input_namespace_name"></a> [namespace_name](#input_namespace_name)                                                                         | Namespace name                            | `string` | `"sourceloop-sandbox"`                       |    no    |
| <a name="input_nginx_image"></a> [nginx_image](#input_nginx_image)                                                                                  | Image version for Nginx                   | `string` | `"nginx:alpine"`                             |    no    |
| <a name="input_notification_ms_microservice_image"></a> [notification_ms_microservice_image](#input_notification_ms_microservice_image)             | Image version for the notification-ms     | `string` | `"sourcefuse/notification-socket-example"`   |    no    |
| <a name="input_pgadmin_image"></a> [pgadmin_image](#input_pgadmin_image)                                                                            | Image version for pgAdmin                 | `string` | `"dpage/pgadmin4"`                           |    no    |
| <a name="input_postgres_image"></a> [postgres_image](#input_postgres_image)                                                                         | Image version for PostgreSQL              | `string` | `"postgres"`                                 |    no    |
| <a name="input_redis_image"></a> [redis_image](#input_redis_image)                                                                                  | Image version for Redis                   | `string` | `"redis"`                                    |    no    |
| <a name="input_scheduler_ms_microservice_image"></a> [scheduler_ms_microservice_image](#input_scheduler_ms_microservice_image)                      | Image version for the scheduler-ms        | `string` | `"sourcefuse/scheduler-example"`             |    no    |
| <a name="input_video_ms_microservice_image"></a> [video_ms_microservice_image](#input_video_ms_microservice_image)                                  | Image version for the video-ms            | `string` | `"sourcefuse/video-conferencing-ms-example"` |    no    |
| <a name="input_workflow_ms_microservice_image"></a> [workflow_ms_microservice_image](#input_workflow_ms_microservice_image)                         | Image version for the workflow-ms         | `string` | `"sourcefuse/workflow-ms-example"`           |    no    |

## Outputs

No outputs.

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

- # SourceFuse
- SourceFuse

module "sandbox_applications" {
  source                = "./tf-k8s-application"
  for_each              = local.k8s_apps
  app_label             = each.value.app_label
  container_image       = each.value.container_image
  container_name        = each.value.container_name
  container_port        = each.value.container_port
  deployment_name       = each.value.deployment_name
  namespace_name        = each.value.namespace_name
  port                  = each.value.port
  port_name             = each.value.port_name
  protocol              = each.value.protocol
  service_name          = each.value.service_name
  target_port           = each.value.target_port
  replica_count         = each.value.replica_count
  environment_variables = each.value.environment_variables
}

locals {
  postgres_host             = "postgres.${kubernetes_namespace.sourceloop_sandbox.metadata[0].name}.svc.cluster.local"
  pg_admin_host             = "pgadmin.${kubernetes_namespace.sourceloop_sandbox.metadata[0].name}.svc.cluster.local"
  audit_ms_host             = "audit-ms-example.${kubernetes_namespace.sourceloop_sandbox.metadata[0].name}.svc.cluster.local"
  redis_host                = "redis.${kubernetes_namespace.sourceloop_sandbox.metadata[0].name}.svc.cluster.local"
  health_check_service_host = "health-check-svc.${kubernetes_namespace.sourceloop_sandbox.metadata[0].name}.svc.cluster.local"
  camunda_host              = "camunda.${kubernetes_namespace.sourceloop_sandbox.metadata[0].name}.svc.cluster.local"
  workflow_ms_host          = "workflow.${kubernetes_namespace.sourceloop_sandbox.metadata[0].name}.svc.cluster.local"
  video_ms_host             = "workflow.${kubernetes_namespace.sourceloop_sandbox.metadata[0].name}.svc.cluster.local"
  k8s_apps = {
    audit_ms_application = {
      app_label       = "audit-ms-example"
      container_image = var.audit_ms_microservice_image
      container_name  = "audit-ms-example"
      container_port  = 3000
      deployment_name = "audit-ms-example"
      namespace_name  = kubernetes_namespace.sourceloop_sandbox.metadata[0].name
      port            = 3000
      port_name       = "3000"
      protocol        = "TCP"
      service_name    = "audit-ms-example"
      target_port     = 3000
      replica_count   = 1
      environment_variables = [
        {
          name  = "DB_DATABASE"
          value = "audit_db"
        },
        {
          name  = "DB_HOST"
          value = local.postgres_host
        },
        {
          name  = "DB_PASSWORD"
          value = "changeme"
        },
        {
          name  = "DB_PORT"
          value = "5432"
        },
        {
          name  = "DB_USER"
          value = "postgres"
        },
        {
          name  = "JWT_ISSUER"
          value = "https://loopback4-microservice-catalog"
        },
        {
          name  = "JWT_SECRET"
          value = "i_am_a_strong_secret"
        },
        {
          name  = "LOG_LEVEL"
          value = "debug"
        },
        {
          name  = "NODE_ENV"
          value = "dev"
        },
        {
          name  = "REDIS_DB"
          value = "0"
        },
        {
          name  = "REDIS_HOST"
          value = local.redis_host
        },
        {
          name  = "REDIS_PASSWORD"
          value = "test"
        },
        {
          name  = "REDIS_PORT"
          value = 6379
        }
      ]
    }
    auth_multitenant_application = {
      app_label       = "auth-multitenant-example"
      container_image = var.auth_multitenant_ms_microservice_image
      container_name  = "auth-multitenant-example"
      container_port  = 3000
      deployment_name = "auth-multitenant-example"
      namespace_name  = kubernetes_namespace.sourceloop_sandbox.metadata[0].name
      port            = 3000
      port_name       = "3000"
      protocol        = "TCP"
      service_name    = "auth-multitenant-example"
      target_port     = 3000
      replica_count   = 1
      environment_variables = [
        {
          name  = "DB_DATABASE"
          value = "authentication_db"
        },
        {
          name  = "DB_HOST"
          value = local.postgres_host
        },
        {
          name  = "DB_PASSWORD"
          value = "changeme"
        },
        {
          name  = "DB_SCHEMA"
          value = "main"
        },
        {
          name  = "DB_PORT"
          value = "5432"
        },
        {
          name  = "DB_USER"
          value = "postgres"
        },
        {
          name  = "JWT_ISSUER"
          value = "https://loopback4-microservice-catalog"
        },
        {
          name  = "JWT_SECRET"
          value = "i_am_a_strong_secret"
        },
        {
          name  = "LOG_LEVEL"
          value = "debug"
        },
        {
          name  = "NODE_ENV"
          value = "dev"
        },
        {
          name  = "REDIS_DB"
          value = "0"
        },
        {
          name  = "REDIS_HOST"
          value = local.redis_host
        },
        {
          name  = "REDIS_PASSWORD"
          value = "test"
        },
        {
          name  = "REDIS_PORT"
          value = 6379
        },
        {
          name  = "KEYCLOAK_CALLBACK_URL"
          value = "test"
        },
        {
          name  = "KEYCLOAK_CLIENT_ID"
          value = "test"
        },
        {
          name  = "KEYCLOAK_CLIENT_SECRET"
          value = "test"
        },
        {
          name  = "KEYCLOAK_HOST"
          value = "test"
        },
        {
          name  = "KEYCLOAK_REALM"
          value = "test"
        },
        {
          name  = "KEYCLOAK_REALM"
          value = "test"
        },
        {
          name  = "LOCALE"
          value = "en"
        },
        {
          name  = "LOG_LEVEL"
          value = "debug"
        },
        {
          name  = "RATE_LIMITER_MAX_REQS"
          value = "100"
        },
        {
          name  = "RATE_LIMITER_WINDOW_MS"
          value = "100"
        },
        {
          name  = "USER_TEMP_PASSWORD"
          value = "tempP@ssw0rd"
        },
        {
          name  = "X_FRAME_OPTIONS"
          value = "SAMEORIGIN"
        }
      ]
    }
    in_mail_ms_application = {
      app_label       = "in-mail-example"
      container_image = var.in_mail_ms_microservice_image
      container_name  = "in-mail-example"
      container_port  = 3000
      deployment_name = "in-mail-example"
      namespace_name  = kubernetes_namespace.sourceloop_sandbox.metadata[0].name
      port            = 3000
      port_name       = "3000"
      protocol        = "TCP"
      service_name    = "in-mail-example"
      target_port     = 3000
      replica_count   = 1
      environment_variables = [
        {
          name  = "DB_DATABASE"
          value = "in_mail_db"
        },
        {
          name  = "DB_HOST"
          value = local.postgres_host
        },
        {
          name  = "DB_PASSWORD"
          value = "changeme"
        },
        {
          name  = "DB_SCHEMA"
          value = "main"
        },
        {
          name  = "DB_PORT"
          value = "5432"
        },
        {
          name  = "DB_USER"
          value = "postgres"
        },
        {
          name  = "JWT_ISSUER"
          value = "https://loopback4-microservice-catalog"
        },
        {
          name  = "JWT_SECRET"
          value = "i_am_a_strong_secret"
        },
        {
          name  = "LOG_LEVEL"
          value = "debug"
        },
        {
          name  = "NODE_ENV"
          value = "dev"
        },
        {
          name  = "REDIS_DB"
          value = "0"
        },
        {
          name  = "REDIS_HOST"
          value = local.redis_host
        },
        {
          name  = "REDIS_PASSWORD"
          value = "test"
        },
        {
          name  = "REDIS_PORT"
          value = 6379
        }
      ]
    }
    notification_ms_application = {
      app_label       = "notification-socket-example"
      container_image = var.notification_ms_microservice_image
      container_name  = "notification-socket-example"
      container_port  = 3000
      deployment_name = "notification-socket-example"
      namespace_name  = kubernetes_namespace.sourceloop_sandbox.metadata[0].name
      port            = 3000
      port_name       = "3000"
      protocol        = "TCP"
      service_name    = "notification-socket-example"
      target_port     = 3000
      replica_count   = 1
      environment_variables = [
        {
          name  = "DB_DATABASE"
          value = "notification_db"
        },
        {
          name  = "DB_HOST"
          value = local.postgres_host
        },
        {
          name  = "DB_PASSWORD"
          value = "changeme"
        },
        {
          name  = "DB_SCHEMA"
          value = "main"
        },
        {
          name  = "DB_PORT"
          value = "5432"
        },
        {
          name  = "DB_USER"
          value = "postgres"
        },
        {
          name  = "JWT_ISSUER"
          value = "https://loopback4-microservice-catalog"
        },
        {
          name  = "JWT_SECRET"
          value = "i_am_a_strong_secret"
        },
        {
          name  = "LOG_LEVEL"
          value = "debug"
        },
        {
          name  = "NODE_ENV"
          value = "dev"
        },
        {
          name  = "REDIS_DB"
          value = "0"
        },
        {
          name  = "REDIS_HOST"
          value = local.redis_host
        },
        {
          name  = "REDIS_PASSWORD"
          value = "test"
        },
        {
          name  = "REDIS_PORT"
          value = 6379
        }
      ]
    }
    scheduler_ms_application = {
      app_label       = "scheduler-example"
      container_image = var.scheduler_ms_microservice_image
      container_name  = "scheduler-example"
      container_port  = 3000
      deployment_name = "scheduler-example"
      namespace_name  = kubernetes_namespace.sourceloop_sandbox.metadata[0].name
      port            = 3000
      port_name       = "3000"
      protocol        = "TCP"
      service_name    = "scheduler-example"
      target_port     = 3000
      replica_count   = 1
      environment_variables = [
        {
          name  = "DB_DATABASE"
          value = "scheduler_db"
        },
        {
          name  = "DB_HOST"
          value = local.postgres_host
        },
        {
          name  = "DB_PASSWORD"
          value = "changeme"
        },
        {
          name  = "DB_SCHEMA"
          value = "main"
        },
        {
          name  = "DB_PORT"
          value = "5432"
        },
        {
          name  = "DB_USER"
          value = "postgres"
        },
        {
          name  = "JWT_ISSUER"
          value = "https://loopback4-microservice-catalog"
        },
        {
          name  = "JWT_SECRET"
          value = "i_am_a_strong_secret"
        },
        {
          name  = "LOG_LEVEL"
          value = "debug"
        },
        {
          name  = "NODE_ENV"
          value = "dev"
        },
        {
          name  = "REDIS_DB"
          value = "0"
        },
        {
          name  = "REDIS_HOST"
          value = local.redis_host
        },
        {
          name  = "REDIS_PASSWORD"
          value = "test"
        },
        {
          name  = "REDIS_PORT"
          value = 6379
        }
      ]
    }
    video_conferencing_ms_application = {
      app_label       = "video-conferencing-ms-example"
      container_image = var.video_ms_microservice_image
      container_name  = "video-conferencing-ms-example"
      container_port  = 3000
      deployment_name = "video-conferencing-ms-example"
      namespace_name  = kubernetes_namespace.sourceloop_sandbox.metadata[0].name
      port            = 3000
      port_name       = "3000"
      protocol        = "TCP"
      service_name    = "video-conferencing-ms-example"
      target_port     = 3000
      replica_count   = 1
      environment_variables = [
        {
          name  = "DB_DATABASE"
          value = "video_db"
        },
        {
          name  = "DB_HOST"
          value = local.postgres_host
        },
        {
          name  = "DB_PASSWORD"
          value = "changeme"
        },
        {
          name  = "DB_SCHEMA"
          value = "main"
        },
        {
          name  = "DB_PORT"
          value = "5432"
        },
        {
          name  = "DB_USER"
          value = "postgres"
        },
        {
          name  = "JWT_ISSUER"
          value = "https://loopback4-microservice-catalog"
        },
        {
          name  = "JWT_SECRET"
          value = "i_am_a_strong_secret"
        },
        {
          name  = "LOG_LEVEL"
          value = "debug"
        },
        {
          name  = "NODE_ENV"
          value = "dev"
        },
        {
          name  = "REDIS_DB"
          value = "0"
        },
        {
          name  = "REDIS_HOST"
          value = local.redis_host
        },
        {
          name  = "REDIS_PASSWORD"
          value = "test"
        },
        {
          name  = "TIME_TO_START"
          value = "10"
        },
        {
          name  = "VONAGE_API_KEY"
          value = "0"
        },
        {
          name  = "VONAGE_API_SECRET"
          value = "abc"
        }
      ]
    }
    workflow_ms_application = {
      app_label       = "workflow-ms-example"
      container_image = var.workflow_ms_microservice_image
      container_name  = "workflow-ms-example"
      container_port  = 3000
      deployment_name = "workflow-ms-example"
      namespace_name  = kubernetes_namespace.sourceloop_sandbox.metadata[0].name
      port            = 3000
      port_name       = "3000"
      protocol        = "TCP"
      service_name    = "workflow-ms-example"
      target_port     = 3000
      replica_count   = 1
      environment_variables = [
        {
          name  = "DB_DATABASE"
          value = "workflow_db"
        },
        {
          name  = "DB_HOST"
          value = local.postgres_host
        },
        {
          name  = "DB_PASSWORD"
          value = "changeme"
        },
        {
          name  = "DB_SCHEMA"
          value = "main"
        },
        {
          name  = "DB_PORT"
          value = "5432"
        },
        {
          name  = "DB_USER"
          value = "postgres"
        },
        {
          name  = "JWT_ISSUER"
          value = "https://loopback4-microservice-catalog"
        },
        {
          name  = "JWT_SECRET"
          value = "i_am_a_strong_secret"
        },
        {
          name  = "LOG_LEVEL"
          value = "debug"
        },
        {
          name  = "NODE_ENV"
          value = "dev"
        },
        {
          name  = "REDIS_DB"
          value = "0"
        },
        {
          name  = "REDIS_HOST"
          value = local.redis_host
        },
        {
          name  = "REDIS_PASSWORD"
          value = "test"
        },
        {
          name  = "CAMUNDA_URL"
          value = "http://${local.camunda_host}/engine-rest"
        }
      ]
    }
    redis_application = {
      app_label             = "redis"
      container_image       = var.redis_image
      container_name        = "redis"
      container_port        = 6379
      deployment_name       = "redis"
      namespace_name        = kubernetes_namespace.sourceloop_sandbox.metadata[0].name
      port                  = 6379
      port_name             = "6379"
      protocol              = "TCP"
      service_name          = "redis"
      target_port           = 6379
      replica_count         = 1
      environment_variables = []
    }
    health_check_application = {
      source                = "./tf-k8s-application"
      app_label             = "nginx"
      container_image       = var.nginx_image
      container_name        = "nginx"
      container_port        = 80
      deployment_name       = "nginx"
      namespace_name        = kubernetes_namespace.sourceloop_sandbox.metadata[0].name
      port                  = 80
      port_name             = "80"
      protocol              = "TCP"
      service_name          = "health-check-svc"
      target_port           = 80
      replica_count         = 1
      environment_variables = []
    }
    //TODO: hook up to DB
    camunda_application = {
      app_label             = "camunda"
      container_image       = var.camunda_image
      container_name        = "camunda"
      container_port        = 8080
      deployment_name       = "camunda"
      namespace_name        = kubernetes_namespace.sourceloop_sandbox.metadata[0].name
      port                  = 8080
      port_name             = "8080"
      protocol              = "TCP"
      service_name          = "camunda"
      target_port           = 8080
      replica_count         = 1
      environment_variables = []
    }
  }
}

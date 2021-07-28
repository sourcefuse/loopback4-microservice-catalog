
resource "kubernetes_service" "default" {

  metadata {
    name      = var.service_name
    namespace = var.namespace_name
    labels = {
      app : var.app_label
    }
  }

  spec {
    port {
      name        = var.port_name
      port        = var.port
      target_port = var.target_port
      protocol    = var.protocol
    }
    selector = {
      app : var.app_label
    }
  }
}

resource "kubernetes_deployment" "default" {
  metadata {
    name      = var.deployment_name
    namespace = var.namespace_name
    labels = {
      app : var.app_label
    }
  }
  spec {
    replicas = var.replica_count
    selector {
      match_labels = {
        app : var.app_label
      }
    }

    template {
      metadata {
        namespace = var.namespace_name
        labels = {
          app : var.app_label
        }
      }
      spec {
        container {
          name  = var.container_name
          image = var.container_image
          port {
            container_port = var.container_port
          }

          dynamic "env" {
            iterator = environment_variable
            for_each = var.environment_variables
            content {
              name  = environment_variable.value["name"]
              value = environment_variable.value["value"]
            }
          }
        }
      }
    }
  }
}


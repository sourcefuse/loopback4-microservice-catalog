resource "kubernetes_namespace" "sourceloop_sandbox" {
  metadata {
    annotations = {
      name = var.namespace_name
    }

    labels = {
      name = var.namespace_name
    }

    name = var.namespace_name
  }
}

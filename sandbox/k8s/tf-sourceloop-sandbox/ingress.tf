resource "kubectl_manifest" "sandbox_ingress" {
  yaml_body  = templatefile("${path.module}/ingress/sourceloop-sandbox-ingress.yaml", {
    namespace = var.namespace_name
  })
  depends_on = [kubernetes_namespace.sourceloop_sandbox]
}

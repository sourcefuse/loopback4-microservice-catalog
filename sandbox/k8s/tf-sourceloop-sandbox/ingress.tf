// TODO: interpolate variables
resource "kubectl_manifest" "sandbox_ingress" {
  yaml_body  = file("${path.module}/ingress/sourceloop-sandbox-ingress.yaml")
  depends_on = [kubernetes_namespace.sourceloop_sandbox]
}

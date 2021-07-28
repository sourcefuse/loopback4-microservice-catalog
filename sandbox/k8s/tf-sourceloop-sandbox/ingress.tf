data "template_file" "ingress_init" {
  template = file("${path.module}/ingress/sourceloop-sandbox-ingress.yaml")
  vars = {
    namespace = var.namespace_name
  }
}


resource "kubectl_manifest" "sandbox_ingress" {
  yaml_body  = data.template_file.ingress_init.rendered
  depends_on = [kubernetes_namespace.sourceloop_sandbox]
}

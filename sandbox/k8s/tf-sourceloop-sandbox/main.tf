resource "kubectl_manifest" "sourceloop_sandbox_namespace" {
  yaml_body = file("${path.module}/namespaces/sourceloop-sandbox-namespace.yaml")
}

resource "kubectl_manifest" "sandbox_manifests" {
  for_each   = fileset(path.module, "*/*.yaml")
  yaml_body  = file(each.key)
  depends_on = [kubectl_manifest.sourceloop_sandbox_namespace]
}

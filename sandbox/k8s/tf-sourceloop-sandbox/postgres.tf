// TODO: update module to handle needs of services like PG and pgadmin
resource "kubectl_manifest" "postgres_manifests" {
  for_each   = fileset(path.module, "postgres/*.yaml")
  yaml_body  = file(each.key)
  depends_on = [kubernetes_namespace.sourceloop_sandbox]
}

resource "kubectl_manifest" "pgadmin_manifests" {
  for_each   = fileset(path.module, "pgadmin/*.yaml")
  yaml_body  = file(each.key)
  depends_on = [kubernetes_namespace.sourceloop_sandbox]
}

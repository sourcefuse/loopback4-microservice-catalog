resource "kubectl_manifest" "audit_ms_migrations" {
  for_each  = fileset(path.module, "audit-ms-example/audit-ms-migration-pod.yaml")
  yaml_body = file(each.key)
  depends_on = [
  kubernetes_namespace.sourceloop_sandbox]
}

resource "kubectl_manifest" "auth_multitenant_ms_migrations" {
  for_each  = fileset(path.module, "auth-multitenant-example/auth-multitenant-migration-pod.yaml")
  yaml_body = file(each.key)
  depends_on = [
  kubernetes_namespace.sourceloop_sandbox]
}

resource "kubectl_manifest" "video_conferencing_migrations" {
  for_each  = fileset(path.module, "video-conferencing-ms-example/video-conferencing-ms-migration-pod.yaml")
  yaml_body = file(each.key)
  depends_on = [
  kubernetes_namespace.sourceloop_sandbox]
}

resource "kubectl_manifest" "workflow_migrations" {
  for_each  = fileset(path.module, "workflow-ms-example/workflow-migration-pod.yaml")
  yaml_body = file(each.key)
  depends_on = [
  kubernetes_namespace.sourceloop_sandbox]
}

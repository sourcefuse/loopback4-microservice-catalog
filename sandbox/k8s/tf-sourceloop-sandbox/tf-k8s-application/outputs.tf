output "service_name" {
  value = kubernetes_service.default.metadata[0].name
}

output "service_port" {
  value = kubernetes_service.default.spec[0].port[0].port
}

output "host" {
  value = "${kubernetes_service.default.metadata[0].name}.${var.namespace_name}.svc.cluster.local"
}

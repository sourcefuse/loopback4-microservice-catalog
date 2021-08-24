// TODO: make variables
provider "kubectl" {
  load_config_file       = true
  config_context_cluster = "microk8s-cluster"
  config_path            = "~/.kube/config"
}

// TODO: make variables
provider "kubernetes" {
  config_context_cluster = "microk8s-cluster"
  config_path            = "~/.kube/config"
}

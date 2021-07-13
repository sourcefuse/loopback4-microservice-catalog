terraform {
  required_version = ">= 0.14"


  required_providers {

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0"
    }

    null = {
      version = "3.1.0"
      source  = "hashicorp/null"
    }

    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.7.0"
    }
  }
}

// TODO: make variables
// TODO: move to another file
provider "kubectl" {
  load_config_file       = true
  config_context         = "sourceloop-sandbox"
  config_context_cluster = "microk8s-cluster"
  config_path            = "~/.kube/config"
}

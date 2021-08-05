terraform {
  required_version = ">= 1.0.3"


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

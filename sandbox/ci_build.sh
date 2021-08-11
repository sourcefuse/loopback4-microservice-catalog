#!/bin/bash
CURRENT_DIR=$1
INSTALL_MICROK8S=$2
LOCAL_REGISTRY='localhost:32000'

install_kubectl() {
  sudo apt-get update -y
  sudo apt-get install -y apt-transport-https ca-certificates curl
  sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
  echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
  sudo apt-get update -y
  sudo apt-get install -y kubectl
  kubectl cluster-info
}

install_microk8s() {
  sudo snap install microk8s --classic
  microk8s status --wait-ready
  microk8s enable dns registry ingress
  microk8s kubectl get all --all-namespaces
  pushd $HOME
  mkdir -p .kube
  microk8s config >.kube/config
  popd
}

local_docker_push() {
  docker push ${LOCAL_REGISTRY}/auth-multitenant-example
  docker push ${LOCAL_REGISTRY}/notification-socket-example
  docker push ${LOCAL_REGISTRY}/workflow-ms-example
  docker push ${LOCAL_REGISTRY}/audit-ms-example
  docker push ${LOCAL_REGISTRY}/scheduler-example
  docker push ${LOCAL_REGISTRY}/video-conferencing-ms-example
  docker push ${LOCAL_REGISTRY}/in-mail-example
}

docker_push() {
  docker tag ${LOCAL_REGISTRY}/auth-multitenant-example ${DOCKER_USERNAME}/auth-multitenant-example
  docker tag ${LOCAL_REGISTRY}/notification-socket-example ${DOCKER_USERNAME}/notification-socket-example
  docker tag ${LOCAL_REGISTRY}/workflow-ms-example ${DOCKER_USERNAME}/workflow-ms-example
  docker tag ${LOCAL_REGISTRY}/audit-ms-example ${DOCKER_USERNAME}/audit-ms-example
  docker tag ${LOCAL_REGISTRY}/scheduler-example ${DOCKER_USERNAME}/scheduler-example
  docker tag ${LOCAL_REGISTRY}/video-conferencing-ms-example ${DOCKER_USERNAME}/video-conferencing-ms-example
  docker tag ${LOCAL_REGISTRY}/in-mail-example ${DOCKER_USERNAME}/in-mail-example

  docker push ${DOCKER_USERNAME}/auth-multitenant-example
  docker push ${DOCKER_USERNAME}/notification-socket-example
  docker push ${DOCKER_USERNAME}/workflow-ms-example
  docker push ${DOCKER_USERNAME}/audit-ms-example
  docker push ${DOCKER_USERNAME}/scheduler-example
  docker push ${DOCKER_USERNAME}/video-conferencing-ms-example
  docker push ${DOCKER_USERNAME}/in-mail-example

  # TODO: should we clean up after build? Since agent is ephemeral, some caching may be helpful after an initial run
  # TODO: remove specific images and cache
  #  docker system prune -a -f
}

terraform_apply() {
  pushd ${CURRENT_DIR}/k8s/tf-sourceloop-sandbox
  terraform init
  terraform apply -auto-approve
  popd
}

terraform_destroy() {
  pushd ${CURRENT_DIR}/k8s/tf-sourceloop-sandbox
  terraform destroy -auto-approve
  popd
}

run_tests() {
  echo "Sleeping to wait for services to come online."
  sleep 180
  ${CURRENT_DIR}/health_check.sh sourceloop.local true
}

if [ ! -z "${DOCKER_USERNAME}" ] && [ ! -z "${DOCKER_PASSWORD}" ]; then
  echo "Logging in to Docker"
  echo "${DOCKER_PASSWORD}" | docker login --username ${DOCKER_USERNAME} --password-stdin
fi

if [ -z "$CURRENT_DIR" ]; then
  CURRENT_DIR=$(echo $PWD)
fi

echo "CURRENT_DIR=$CURRENT_DIR"

sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o ${CURRENT_DIR}/docker-compose --insecure
sudo chmod +x ${CURRENT_DIR}/docker-compose

sudo REGISTRY=$LOCAL_REGISTRY ./docker-compose -f "${CURRENT_DIR}/docker-compose.yml" build

if [ "${INSTALL_MICROK8S}" = "true" ]; then
  install_microk8s
  install_kubectl
fi

local_docker_push
terraform_apply
run_tests
terraform_destroy
docker_push

#!/bin/bash
CURRENT_DIR=$1
INSTALL_MICROK8S=$2
LOCAL_REGISTRY='localhost:32000'

install_microk8s() {
  sudo snap install microk8s --classic
  microk8s status --wait-ready
  microk8s enable dns registry
  microk8s kubectl get all --all-namespaces
  pushd $HOME
  mkdir .kube
  cd .kube
  microk8s config > config
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
  docker tag ${LOCAL_REGISTRY}/workflow-ms-examp ${DOCKER_USERNAME}/workflow-ms-example
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
#  docker system prune -a -f
}

apply_terraform() {
  pushd ${CURRENT_DIR}/k8s/tf-sourceloop-sandbox
  terraform init
  terraform apply -auto-approve
  popd
}

run_tests() {
  echo "Sleeping to wait for services to come online."
  sleep 30
  ${CURRENT_DIR}/k8s/health_check.sh sourceloop.local
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
fi

local_docker_push
apply_terraform
run_tests
docker_push

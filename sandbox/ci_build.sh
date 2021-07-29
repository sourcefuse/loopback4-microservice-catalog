#!/bin/bash
CURRENT_DIR=$1

if [ ! -z "${DOCKER_USERNAME}" ] && [ ! -z "${DOCKER_PASSWORD}" ]; then
  echo "Logging in to Docker"
  echo "${DOCKER_PASSWORD}" | sudo docker login --username ${DOCKER_USERNAME} --password-stdin
fi

if [ -z "$CURRENT_DIR" ]; then
  CURRENT_DIR=$(echo $PWD)
fi

echo "CURRENT_DIR=$CURRENT_DIR"

sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o ${CURRENT_DIR}/sandbox/docker-compose --insecure
sudo chmod +x ${CURRENT_DIR}/sandbox/docker-compose

export REGISTRY=$DOCKER_USERNAME; ./docker-compose -f "${CURRENT_DIR}/docker-compose.yml" build
sudo docker push ${DOCKER_USERNAME}/auth-multitenant-example
sudo docker push ${DOCKER_USERNAME}/notification-socket-example
sudo docker push ${DOCKER_USERNAME}/workflow-ms-example
sudo docker push ${DOCKER_USERNAME}/audit-ms-example
sudo docker push ${DOCKER_USERNAME}/scheduler-example
sudo docker push ${DOCKER_USERNAME}/video-conferencing-ms-example
sudo docker push ${DOCKER_USERNAME}/in-mail-example

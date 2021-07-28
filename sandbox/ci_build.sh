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

export REGISTRY=$DOCKER_USERNAME; sudo docker-compose -f "${CURRENT_DIR}/docker-compose.yml" build
sudo docker push ${DOCKER_USERNAME}/auth-multitenant-example
sudo docker push ${DOCKER_USERNAME}/notification-socket-example
sudo docker push ${DOCKER_USERNAME}/workflow-ms-example
sudo docker push ${DOCKER_USERNAME}/audit-ms-example
sudo docker push ${DOCKER_USERNAME}/scheduler-example
sudo docker push ${DOCKER_USERNAME}/video-conferencing-ms-example
sudo docker push ${$DOCKER_USERNAME}/in-mail-example

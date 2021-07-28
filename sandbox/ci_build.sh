#!/bin/bash
REGISTRY=$1

# TODO: remove file once agent is fixed

if [ -z "$REGISTRY" ]; then
  REGISTRY="localhost:32000"
  echo "${REGISTRY}"
else
  echo "${REGISTRY}"
fi

if [ ! -z "${DOCKER_USERNAME}" ] && [ ! -z "${DOCKER_PASSWORD}" ]; then
  echo "Logging in to Docker"
  echo "${DOCKER_PASSWORD}" | sudo docker login --username ${DOCKER_USERNAME} --password-stdin
fi


CURRENT_DIR=$(echo $PWD)

export REGISTRY=$REGISTRY; sudo docker-compose -f "${CURRENT_DIR}/docker-compose.yml" build
sudo docker push ${REGISTRY}/auth-multitenant-example
sudo docker push ${REGISTRY}/notification-socket-example
sudo docker push ${REGISTRY}/workflow-ms-example
sudo docker push ${REGISTRY}/audit-ms-example
sudo ocker push ${REGISTRY}/scheduler-example
sudo docker push ${REGISTRY}/video-conferencing-ms-example
sudo docker push ${REGISTRY}/in-mail-example

#!/bin/bash
REGISTRY=$1
CURRENT_DIR=$2

# TODO: remove sudo once build agent is fixed

if [ -z "$REGISTRY" ]; then
  REGISTRY="localhost:32000"
  echo "${REGISTRY}"
else
  echo "${REGISTRY}"
fi

if [ ! -z "${DOCKER_USERNAME}" ] && [ ! -z "${DOCKER_PASSWORD}" ]; then
  echo "Logging in to Docker"
  echo "${DOCKER_PASSWORD}" | docker login --username ${DOCKER_USERNAME} --password-stdin
fi

if [ -z "$CURRENT_DIR" ]; then
  CURRENT_DIR=$(echo $PWD)
fi

echo "CURRENT_DIR=$CURRENT_DIR"

export REGISTRY=$REGISTRY; docker-compose -f "${CURRENT_DIR}/docker-compose.yml" build
docker push ${REGISTRY}/auth-multitenant-example
docker push ${REGISTRY}/notification-socket-example
docker push ${REGISTRY}/workflow-ms-example
docker push ${REGISTRY}/audit-ms-example
docker push ${REGISTRY}/scheduler-example
docker push ${REGISTRY}/video-conferencing-ms-example
docker push ${REGISTRY}/in-mail-example

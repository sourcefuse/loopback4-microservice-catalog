#!/bin/bash
REGISTRY=$1

if [ -z "$REGISTRY" ];
  then REGISTRY="localhost:32000";
  else echo "${REGISTRY}"
fi

docker-compose build
docker push ${REGISTRY}/auth-multitenant-example
docker push ${REGISTRY}/notification-socket-example
docker push ${REGISTRY}/workflow-ms-example
docker push ${REGISTRY}/audit-ms-example
docker push ${REGISTRY}/scheduler-example
docker push ${REGISTRY}/video-conferencing-ms-example
docker push ${REGISTRY}/in-mail-example

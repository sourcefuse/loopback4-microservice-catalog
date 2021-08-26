#!/bin/bash
DOMAIN=$1
IS_LOCALHOST=$2
ERROR_COUNT=0

# check the basic health check on its own
if [ "$IS_LOCALHOST" = "true" ]; then
  curl_response=$(curl -Is -H "Host: health-check.${DOMAIN}" https://localhost --insecure -f)
else
  curl_response=$(curl -Is -H "Host: health-check.${DOMAIN}" https://health-check.${DOMAIN} --insecure -f)
fi

if [ -z "$curl_response" ]; then
  echo "health-check service is unhealthy"
  ERROR_COUNT=$((ERROR_COUNT + 1))
fi

# TODO: Add video when it works - "video"
declare -a services=("workflow" "scheduler" "notification" "in-mail" "auth" "audit")

for service in "${services[@]}"; do
  if [ "$IS_LOCALHOST" = "true" ]; then
    curl_response=$(curl -Is -H "Host: ${service}.${DOMAIN}" https://localhost/openapi.json --insecure -f)
  else
    curl_response=$(curl -Is -H "Host: ${service}.${DOMAIN}" https://${service}.${DOMAIN}/openapi.json --insecure -f)
  fi

  if [ -z "$curl_response" ]; then
    echo "${service} service is unhealthy"
    ERROR_COUNT=$((ERROR_COUNT + 1))
  fi
done

if (($ERROR_COUNT > 0)); then
  echo "${ERROR_COUNT} services are unhealthy"
  exit 1
else
  echo "All services are healthy"
fi

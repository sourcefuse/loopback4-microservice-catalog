#!/bin/bash
DOMAIN=$1
ERROR_COUNT=0

# TODO: Add video when it works - "video"
declare -a services=("workflow" "scheduler" "notification" "in-mail" "auth" "audit")

for service in "${services[@]}"; do
  curl_response=$(curl -Is -H "Host: ${service}.sourceloop.local" https://${service}.${DOMAIN}/openapi.json --insecure -f)
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

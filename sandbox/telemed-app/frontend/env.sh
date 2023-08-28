#!/bin/bash

envsubst "$(printf '${%s} ' $(env | cut -d'=' -f1))" < config.template.json > config.json
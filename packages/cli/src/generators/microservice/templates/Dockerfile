# syntax=docker/dockerfile:1
#
# LEGACY full build. It installs and compiles inside the image.
# The pipeline uses it only when USE_NFT_BUILD is off. It is the fallback
# for Dockerfile.nft and does not need a host build or the deps image.
#
# Build context: the repo root. Build args:
#   SERVICE_NAME  folder name of this service, e.g. auth-service
#   FROM_FOLDER   services or facades
#
# All three Dockerfiles (this one, Dockerfile.nft, Dockerfile.code) must make
# the same runtime layout, because a code build overlays dist on the last
# full-build image, whichever of the two full builds made it.
ARG nodeVer=24-alpine

FROM node:${nodeVer} AS build
ARG SERVICE_NAME
ARG FROM_FOLDER

USER node
WORKDIR /home/node/app

COPY --chown=node package*.json ./
# `packag[e]s` is a wildcard, so the COPY does not fail in a repo with no
# local packages.
COPY --chown=node packag[e]s ./packages/
COPY --chown=node ${FROM_FOLDER}/${SERVICE_NAME} ./${FROM_FOLDER}/${SERVICE_NAME}

RUN --mount=type=cache,target=/home/node/.npm,id=npm-cache,uid=1000,gid=1000 \
    npm ci --ignore-scripts --no-audit --no-fund
# If the repo has `patches/`, copy it above and apply it here:
# RUN npx --yes --ignore-scripts patch-package@8.0.1 --error-on-fail

# Workspaces build in declaration order, so local packages build first.
RUN npm run build --workspaces --if-present

RUN --mount=type=cache,target=/home/node/.npm,id=npm-cache,uid=1000,gid=1000 \
    npm prune --omit=dev --ignore-scripts
# Optional cleanup. This image copies node_modules whole, so here it helps.
# RUN npx --yes --ignore-scripts clean-modules --yes

FROM node:${nodeVer}
ARG SERVICE_NAME
ARG FROM_FOLDER

WORKDIR /home/node/app

COPY --from=build --chown=node /home/node/app/node_modules ./node_modules
COPY --from=build --chown=node /home/node/app/${FROM_FOLDER}/${SERVICE_NAME}/dist ./dist
COPY --from=build --chown=node /home/node/app/${FROM_FOLDER}/${SERVICE_NAME}/node_module[s] ./node_modules/
COPY --from=build --chown=node /home/node/app/${FROM_FOLDER}/${SERVICE_NAME}/package.json ./package.json
COPY --from=build --chown=node /home/node/app/${FROM_FOLDER}/${SERVICE_NAME}/public ./public
COPY --from=build --chown=node /home/node/app/${FROM_FOLDER}/${SERVICE_NAME}/.env.defaults /home/node/app/${FROM_FOLDER}/${SERVICE_NAME}/.env.example ./
COPY --from=build --chown=node /home/node/app/packag[e]s ./packages/

USER node

ENV HOST=0.0.0.0 PORT=3000
EXPOSE ${PORT}

CMD [ "node", "-r", "./dist/opentelemetry-registry.js", "." ]

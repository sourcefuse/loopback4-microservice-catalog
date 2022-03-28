# Check out https://hub.docker.com/_/node to select a new base image
FROM node:16-alpine AS BUILD_IMAGE

RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*
RUN curl -sfL https://gobinaries.com/tj/node-prune | bash -s -- -b /usr/local/bin

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

# Bundle app source code
COPY --chown=node . .
RUN npm run build

# To make npm prune work, else it looks for symbolically linked packages as well
RUN rm package-lock.json

# Workaround for symlinked packages [copy packages in temp folder]
RUN mkdir -p /tmp/app-packages
# COPY --chown=node node_modules/@local/core /tmp/app-packages/core

# Run node prune
RUN npm prune --production
RUN /usr/local/bin/node-prune

# Workaround for symlinked packages [npm prune for all packages]
# WORKDIR /tmp/app-packages/core
RUN npm prune --production
RUN /usr/local/bin/node-prune

# Workaround for symlinked packages [reset WORKDIR]
WORKDIR /home/node/app

FROM node:16-alpine
WORKDIR /home/node/app

ARG NR_ENABLED

# Copy from build image
COPY --from=BUILD_IMAGE /home/node/app/dist ./dist
COPY --from=BUILD_IMAGE /home/node/app/public ./public
COPY --from=BUILD_IMAGE /home/node/app/node_modules ./node_modules

# Workaround for symlinked packages [copy all packages manually]
# COPY --from=BUILD_IMAGE /tmp/app-packages/core ./node_modules/@local/core

COPY --from=BUILD_IMAGE /home/node/app/.env.example ./.env.example
COPY --from=BUILD_IMAGE /home/node/app/.env.defaults ./.env.defaults

RUN if [ "$NR_ENABLED" = "1" ] ; then npm i newrelic; fi

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=::
ENV PORT=3000
EXPOSE ${PORT}

CMD [ "node", "-r", "./dist/opentelemetry-registry.js", "./dist/index.js" ]

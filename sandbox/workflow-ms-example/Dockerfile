# Check out https://hub.docker.com/_/node to select a new base image
FROM node:16-alpine

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

ARG WORKFLOW_MIGRATION_SKIP
ENV WORKFLOW_MIGRATION_SKIP=$WORKFLOW_MIGRATION_SKIP
ARG WORKFLOW_MIGRATION_COPY
ENV WORKFLOW_MIGRATION_COPY=$WORKFLOW_MIGRATION_COPY  

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./
COPY --chown=node . .

RUN npm install

# Bundle app source code

RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}
CMD [ "node", "." ]

# Check out https://hub.docker.com/_/node to select a new base image
ARG nodeVer=18-alpine

# select a base image to build from
FROM node:$nodeVer AS BASE

# Take the build variables for image base
ARG SERVICE_NAME
ARG FROM_FOLDER
# This command is used to install some dependencies in the Docker image.
# Nessasary for running node-prune and npm install
RUN  apk update &&  apk add --no-cache --virtual .gyp \
    python3 \
    make \
    g++ \
    bash \
    curl

# This is used to download and install the `node-prune` tool in the Docker image.
RUN curl -sfL https://gobinaries.com/tj/node-prune | bash -s -- -b /usr/local/bin

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

# Set the working directory to `/home/node/app`
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

# The following two commands is used to copy the `packages`,`service` directory from the local file system to the Docker image.
#  The `--chown=node` flag ensures that the ownership of the copied files/directories is set to the `node` user.
#  This is important because the subsequent commands in the Dockerfile are executed with the `node` user,
#  and it needs the appropriate permissions to access and modify the copied files/directories.
COPY --chown=node packages ./packages

COPY --chown=node $FROM_FOLDER/$SERVICE_NAME ./$FROM_FOLDER/$SERVICE_NAME

# Installing all dependencies
RUN npm install

# Building the app
# set the Working Directory to the service
WORKDIR /home/node/app/$FROM_FOLDER/$SERVICE_NAME
# Run Build Command
RUN npm run build

# Run node-prune
RUN npm prune --production
RUN /usr/local/bin/node-prune

# Start fresh for a smaller  image size
FROM node:$nodeVer

# Take the build variables for image stage
ARG SERVICE_NAME
ARG FROM_FOLDER

RUN mkdir -p /home/node/app

USER node

WORKDIR /home/node/app


# These `COPY` commands are used to copy files and directories from the `BASE` 
# stage of the Docker image to the current stage.
COPY --from=BASE --chown=node /home/node/app/node_modules ./node_modules
COPY --from=BASE --chown=node /home/node/app/package.json ./
COPY --from=BASE --chown=node /home/node/app/package-lock.json ./
COPY --from=BASE --chown=node /home/node/app/packages ./packages
COPY --from=BASE --chown=node /home/node/app/$FROM_FOLDER/$SERVICE_NAME ./$FROM_FOLDER/$SERVICE_NAME

# Set the working directory to `/home/node/app/services/auth-service`
WORKDIR /home/node/app/$FROM_FOLDER/$SERVICE_NAME


# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}

CMD [ "node", "." ]
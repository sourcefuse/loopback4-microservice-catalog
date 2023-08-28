# Check out https://hub.docker.com/_/node to select a new base image
FROM public.ecr.aws/lambda/nodejs:18-x86_64 AS BUILD_IMAGE

# Create app directory
RUN mkdir -p ${LAMBDA_TASK_ROOT}

WORKDIR ${LAMBDA_TASK_ROOT}

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source code
COPY . .

# Build Loopback app
RUN npm run build

CMD [ "./dist/lambda.handler" ]

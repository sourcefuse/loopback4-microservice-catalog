FROM node:24.22.1-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
CMD [ "npm", "run", "start:dev" ]
EXPOSE 4000
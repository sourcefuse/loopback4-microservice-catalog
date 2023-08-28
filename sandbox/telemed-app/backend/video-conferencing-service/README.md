# Telemed Video Conferencing Service

This application is generated using ARC CLI and serves as the Video Conferencing Microservice for the Telemedicine Application.

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.


## How to Deploy

To deploy this service on AWS lambda, refer the following steps, ensure that you're in the `video-conferencing-service` directory:

1. Run `npm run build` to generate the code build
2. Run `npm run build:layers` to generate the node_modules as lambda layers
3. Run `npm run build:migrations` to install dependencies as layers for database migration code which will be deployed as a separate lambda function.
4. We can choose to skip running commands mentioned in step 1-3 and directly run `npm run build:all` to build the lambda layers, code build and migrations for the service
5. Step into cdk folder inside the service and update the `.env` file (make sure upstream dependencies like PostgreSQL DB are already setup and the database is created).
6. Run `npx cdktf deploy migration` to deploy the migration lambda on AWS using terraform constructs.
7. Run `npx cdktf deploy lambda` to deploy the service lambda on AWS using terraform constructs.

For more information on the steps and environment variable needed for CDK to run [check this](./cdk/README.md).


## Environment Variables

This service picks up environment variables from AWS Secrets Manager, To run the service successfully, you need to set up the following environment variables the in secrets manager with the secret named `telemed-app-service-video-conferencing`, or you can customize this name by modifying `config.ts` inside `src` folder.

| Environment Variable      | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| DB_HOST                   | The hostname of the database.                                 |
| DB_USER                   | The username of the database.                                 |
| DB_PASSWORD               | The password of the database.                                 |
| DB_DATABASE               | The name of the notificatoin database.                        |
| DB_SCHEMA                 | The schema of the postgres database to use.                   |
| JWT_SECRET                | JWT Secret to validate signed bearer tokens.                  |
| JWT_ISSUER                | The issuer for the JWT token.                                 |
| VONAGE_API_KEY            | The API Key of Vonage.                                        |
| VONAGE_API_SECRET         | The API Secret of Vonage.                                     |



## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

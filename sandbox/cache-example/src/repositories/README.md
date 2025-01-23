# CacheExample

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## STEP 1: Install dependencies

To install the project dependencies, run the following command:

```sh
npm install
```
## STEP 2: Set up Environment Variables
1. Copy the .env.example file to .env:

```sh
cp .env.example .env
```
2. Open the .env file and configure the necessary environment variables (e.g., database connection settings, redis connection settings).

## STEP 3: Database Migration
Run the following command to migrate the database:
```sh
npm run db:migrate
```

## STEP 4: Start the application
Once everything is set up, you can start the Node.js application with the following command:
```sh
npm start
```
This will start the server, and you can begin testing the API.

## STEP 5: Testing the API
After starting the application, you can test the API using Swagger UI. Open your browser and visit:

http://127.0.0.1:3000 Replace the URL according to your configuration

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
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```

## Troubleshooting
* Ensure that your database is correctly configured and running.
* Make sure that the JWT private and public keys are properly set up in the .env file.
* If you encounter issues with Swagger UI not loading, verify that the server has successfully started and that the correct port is specified.

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](<https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

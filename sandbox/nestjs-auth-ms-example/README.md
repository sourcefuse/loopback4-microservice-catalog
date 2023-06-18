# NestJS - Auth Service Example

## Description

This is an example NestJS Application that uses ARC's (aka SourceLoop) pre-built microservice for authentication.

## Installation

```bash
$ npm install
```

## Trying it out

The migrations comes with seed data having a dummy client entry and two users.

```json
{
  "client_id": "temp_client",
  "client_secret": "temp_secret",
  "username": "john.doe@example.com",
  "password": "test123!@#"
}
```

Another username you can try out things with is `sarah.rafferty@example.com` with same password.
You can try out above json as request body of the login route provided by the sourceloop authentication service.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```

```

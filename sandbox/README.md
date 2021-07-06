# Sandbox Examples
The sandbox examples have been pre-configured with a `docker-compose` file for easy setup. Please examine the environment variables in the file prior to running and change the variables where appropriate. For example, if you want to test the Keycloak integration, plugin your configuration values to the `docker-compose.yml` file. 

## Basic Setup
You must have `docker-compose` installed locally. This is not a production grade setup.

To start the services, simply run from this directory.
```shell
docker-compose up --build
```

If you would like the services to run in detached mode, supply the `-d` parameter.

The services are now running under the following:
* [audit-ms-example](http://localhost:3032/explorer)
* [notification-example](http://localhost:3030/explorer)
* [auth-multitenant-example](http://localhost:3000/explorer)
* [in-mail-example](http://localhost:3033/explorer)
* [notification-socket-example](http://localhost:3030/explorer)
* [scheduler-example](http://localhost:3034/explorer)
* [video-conferencing-ms-example](http://localhost:3040/explorer)
* [workflow-ms-example](http://localhost:3031/explorer)
* [Camunda](http://localhost:8080)
* [pgAdmin](http://localhost:5050)
* PostgreSQL - localhost:5432
* Redis - localhost:6739

Credentials for the database and pgAdmin are in the `docker-compose` file or can be overridden with environment variables. An orchestration container creates all of the databases and another runs the service DB migrations for you.

When connecting to PostgreSQL or from within one of the containers, pay attention to the network and service name defined in the `docker-compose` file, since you will connect via the Docker network and service name.
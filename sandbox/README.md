# Sandbox Examples
The sandbox examples have been preconfigured with a `docker-compose` file for easy setup. Please examine the environment variables in the file prior to running and change the variables where appropriate. For example, if you want to test the Keycloak integration, plugin your configuration values to the `docker-compose.yml` file. 

## Basic Setup
You must have `docker-compose` installed locally. This is not a production grade setup.

To start the services, simply run from this directory.
```shell
docker-compose up
```

If you would like the services to run in detached mode, supply the `-d` parameter.

The services are now running under the following:
* [notification-example](http://localhost:3030)
* [auth-multitenant-example](http://localhost:3000)
* [pgAdmin](http://localhost:5050)
* PostgreSQL - localhost:5432
* Redis - localhost:6739

Credentials for the database and pgAdmin are in the `docker-compose` file or can be overridden with environment variables. An orchestration container also runs that creates two databases: `notification_db` and `authentication_db`. You will still need to run the database migrations yourself.

When connecting to PostgreSQL or from within one of the containers, pay attention to the network and service name defined in the `docker-compose` file, since you will connect via the Docker network and service name.
# Telemed App API

The ARC Telemedicine App is a proof-of-concept application that enables seamless communication between doctors and patients through video calls and chat. The app aims to provide a virtual healthcare solution, allowing medical professionals to conduct remote consultations and provide personalized care to patients from the comfort of their own homes in real time.

This repository contains the code for various backend micro-services used in the Telemed App. You have the option to run these services locally or deploy them on AWS Lambda with API Gateway.

# Services Included

- [Authentication Service](./authentication-service/)
- [Notification Service](./notification-service)
- [Video Conferencing Service](./video-conferencing-service)

## <a id="prereqs"></a> Pre-Requisites

- [node.js](https://nodejs.dev/download/)
- [npm](https://docs.npmjs.com/cli/v6/commands/npm-install)
- [aws-cli](https://aws.amazon.com/cli/)
- [Terraform](https://www.terraform.io/)
- [cdktf-cli](https://www.npmjs.com/package/cdktf-cli)

## How to Use

- Scaffold the `telemed-app-api` template from backstage.
- Step into the folder and run `npm i` to install node_modules (and to create envs).
- Run `npx lerna bootstrap` to install dependencies of all the services.
- To run any service locally, step into the service folder and update required values in AWS secret manager beforehand.
- Run `npm start` to start the development server.

## How to Deploy

To deploy the service on AWS lambda, refer the following steps after stepping into the service folder you want to deploy:

1. Run `npm run build` to generate the code build
2. Run `npm run build:layers` to generate the node_modules as lambda layers
3. Run `npm run build:migrations` to install dependencies as layers for database migration code which will be deployed as a separate lambda function.
4. We can choose to skip running commands mentioned in step 1-3 and directly run `npm run build:all` to build the lambda layers, code build and migrations for the service
5. Step into cdk folder inside the service and update the .env file (Make sure upstream dependencies like PostgreSQL DB are already setup).
6. Run `npx cdktf deploy migration` to deploy the migration lambda on AWS using terraform constructs.
7. Run `npx cdktf deploy lambda` to deploy the service lambda on AWS using terraform constructs.

## References

At ARC, our mission is to empower developers and organizations by providing seamless solutions for developing and deploying applications, both on the backend and frontend. We are committed to ensuring that every aspect of app development adheres to the highest security and industry standards, ensuring a smooth and secure user experience.

As part of our commitment to the open-source community, we actively contribute to a range of projects, some of which include:

- [ARC Docs](https://sourcefuse.github.io/arc-docs)
- [ARC API](https://github.com/sourcefuse/loopback4-microservice-catalog/)
- [ARC Lambda](https://github.com/sourcefuse/arc-lambda)
- [ARC IaC](https://sourcefuse.github.io/arc-docs/arc-iac-docs/)
- [ARC React Boilerplate](https://github.com/sourcefuse/react-boilerplate-ts-ui/)

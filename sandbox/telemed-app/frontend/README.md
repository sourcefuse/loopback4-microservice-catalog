# ARC Telemedicine

The ARC Telemedicine App is a proof-of-concept application that enables seamless communication between doctors and patients through video calls and chat. The app aims to provide a virtual healthcare solution, allowing medical professionals to conduct remote consultations and provide personalized care to patients from the comfort of their own homes in real time.

![Screenshot 2023-08-02 at 9 33 06 AM](https://github.com/sourcefuse/loopback4-microservice-catalog/assets/107536993/ba9aa71c-3fe4-47d5-a78c-eb264de3a197)


## How to use

- Clone the [github repo](https://github.com/sourcefuse/telemed-app-ui)
- cd into the folder and run `npm i` to install all the required dependencies.
- Add the [environment variables](#environment-variables) to connect to ARC backend services.
- Run `npm start` to run the vite development server.
- To deploy the app checkout [Deploy](#deploy) section.

## Deploy

This repository contains code that demonstrates how to deploy a Single-Page Application (SPA) to Amazon Web Services (AWS) S3 and CloudFront using Cloud Development Kit for Terraform (CDKTF) for TypeScript. The deployment process involves creating an S3 bucket, configuring CloudFront distribution, setting up DNS with Route 53, and uploading the SPA files to the S3 bucket.

You can use the cdk contained in the project to deploy your web app.
Just build you app using build script `npm run build` and
follow along the steps mentioned [here](./cdk/README.md)

## Environment Variables

To run the project successfully, you need to set up the following environment variables. Create a `.env` file in the root directory of the project and set the following environment variables:

| Environment Variable      | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| CLIENT_ID                 | The client ID used for authentication.                        |
| AUTH_API_BASE_URL         | The base URL for the authentication service.                  |
| NOTIFICATION_API_BASE_URL | The base URL for the notification service.                    |
| VIDEO_API_BASE_URL        | The base URL for the video service.                           |
| PUBNUB_PUBLISH_KEY        | The PubNub publish key used for sending messages.             |
| PUBNUB_SUBSCRIBE_KEY      | The PubNub subscribe key used for receiving messages.         |
| NOTIFICATION_CHANNEL_UUID | A random UUID used as the channel ID for notifications.       |
| CHAT_CHANNEL_UUID         | Another random UUID used as the channel ID for chat messages. |
| VONAGE_API_KEY            | The Vonage API key required to interact with the Vonage API.  |

To generate PubNub keys, follow this [guide](https://www.pubnub.com/how-to/admin-portal-create-keys/).

To generate a Vonage key, refer to this [guide](https://developer.vonage.com/en/getting-started/overview?source=getting-started).

For the `NOTIFICATION_CHANNEL_UUID` and `CHAT_CHANNEL_UUID`, you can use any random UUID generator, such as [this one](https://www.uuidgenerator.net/).

## <a id="scripts"></a> Scripts

| Script           | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| npm start        | Runs the app in the development mode                                                       |
| npm run config   | Generates config file from .env , this file is used for runtime configuration for env vars |
| npm run build    | Builds the app for production to the `build` folder.                                       |
| npm run lint     | Checks linting error in code                                                               |
| npm run lint:fix | Fix all auto-fixable lint errors                                                           |
| npm run format   | Format all files using prettier                                                            |

## Our Other Projects Worth Checking Out

At ARC, our mission is to empower developers and organizations by providing seamless solutions for developing and deploying applications, both on the backend and frontend. We are committed to ensuring that every aspect of app development adheres to the highest security and industry standards, ensuring a smooth and secure user experience.

As part of our commitment to the open-source community, we actively contribute to a range of projects, some of which include:

- [loopback4-microservice-catalog](https://github.com/sourcefuse/loopback4-microservice-catalog/)
- [arc-lambda](https://github.com/sourcefuse/arc-lambda)
- [arc-iac](https://sourcefuse.github.io/arc-docs/arc-iac-docs/)
- [react-boilerplate](https://github.com/sourcefuse/react-boilerplate-ts-ui/)

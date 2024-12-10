const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');
const secretName = 'telemed-app-service-video-conferencing';
const client = new SecretsManagerClient({
  region: 'us-east-1',
});
export interface SecretEnv {
  DB_HOST: string;
  DB_PORT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_SCHEMA: string;
  JWT_SECRET: string;
  ENV: string;
}

let secret: SecretEnv;

export async function getSecretValue() {
  let response;
  // eslint-disable-next-line
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      }),
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }

  secret = JSON.parse(response.SecretString);
  // Your code goes here, make use of the 'secret' variable as needed
  //   console.log("Retrieved secret:", secret);
  return secret;
}


const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');
// eslint-disable-next-line @typescript-eslint/naming-convention
const secret_name = 'telemed-app-service-authentication';
const client = new SecretsManagerClient({
  region: 'us-east-1',
});
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface secretEnv {
  DB_HOST: string;
  DB_PORT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_SCHEMA: string;
  JWT_SECRET: string;
  ENV: string;
}

let secret: secretEnv;

export async function getSecretValue() {
  let response;
  // eslint-disable-next-line
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
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

// process.env={DB_HOST:'localhostSF'};

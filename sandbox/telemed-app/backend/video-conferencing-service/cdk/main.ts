import {App} from 'cdktf';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {resolve} from 'path';
import {LambdaStack, MigrationStack} from './common';

dotenv.config();
dotenvExt.load({
  schema: '.env.example',
  errorOnMissing: true,
  includeProcessEnv: true,
});

const app = new App();

const getSubnetIds = () => {
  try {
    const subnetIds = process.env?.SUBNET_IDS ?? '';
    return JSON.parse(subnetIds);
  } catch (e) {
    console.error(e); // NOSONAR
  }
  return [];
};

const getSecurityGroup = () => {
  try {
    const securityGroup = process.env?.SECURITY_GROUPS ?? '';
    return JSON.parse(securityGroup);
  } catch (e) {
    console.error(e); // NOSONAR
  }
  return [];
};
// sonarignore:start
new MigrationStack(app, 'migration', {
  // sonarignore:end
  codePath: resolve(__dirname, '../migration'),
  handler: 'lambda.handler',
  runtime: 'nodejs18.x',
  vpcConfig: {
    securityGroupIds: getSecurityGroup(),
    subnetIds: getSubnetIds(),
  },
  memorySize: 256,
  invocationData: '{}',
  timeout: 60,
  envVars: {
    DB_HOST: process.env.DB_HOST ?? '',
    DB_PORT: process.env.DB_PORT ?? '',
    DB_USER: process.env.DB_USER ?? '',
    DB_PASSWORD: process.env.DB_PASSWORD ?? '',
    DB_DATABASE: process.env.DB_DATABASE ?? '',
  },
  namespace: process.env.NAMESPACE ?? '',
  environment: process.env.ENV ?? '',
});
// sonarignore:start
new LambdaStack(app, 'lambda', {
  // sonarignore:end
  s3Bucket: process.env.S3_BUCKET!,
  codePath: __dirname,
  handler: 'lambda.handler',
  runtime: 'nodejs18.x',
  layerPath: resolve(__dirname, '../layers'),
  vpcConfig: {
    securityGroupIds: getSecurityGroup(),
    subnetIds: getSubnetIds(),
  },
  memorySize: 256,
  timeout: 30,
  customDomainName: {
    domainName: process.env.DOMAIN_NAME ?? '',
    hostedZoneId: process.env.HOSTED_ZONE_ID ?? '',
  },
  namespace: process.env.NAMESPACE ?? '',
  environment: process.env.ENV ?? '',
  createRole: {
    iamPolicy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
            'ec2:CreateNetworkInterface',
            'ec2:DescribeNetworkInterfaces',
            'ec2:DeleteNetworkInterface',
            'ec2:AssignPrivateIpAddresses',
            'ec2:UnassignPrivateIpAddresses',
            'secretsmanager:GetSecretValue',
          ],
          Resource: '*',
        },
      ],
    }),
    iamRole: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Principal: {
            Service: 'lambda.amazonaws.com',
          },
          Effect: 'Allow',
          Sid: '',
        },
      ],
    }),
  },
  useImage: true,
});

app.synth();

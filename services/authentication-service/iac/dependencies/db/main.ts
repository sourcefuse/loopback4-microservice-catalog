import * as aws from '@cdktf/provider-aws';
import {App, TerraformStack} from 'cdktf';
import {Construct} from 'constructs';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {DbModule, DbModuleConfig} from './.gen/modules/dbModule';

dotenv.config();
dotenvExt.load({
  schema: '.env.example',
  errorOnMissing: true,
  includeProcessEnv: true,
});

export class DbStack extends TerraformStack {
  constructor(scope: Construct, name: string, options: DbModuleConfig) {
    super(scope, name);

    new aws.provider.AwsProvider(this, 'aws', {
      // NOSONAR
      region: process.env.AWS_REGION,
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_SECRET_ACCESS_KEY,
      profile: process.env.AWS_PROFILE,
      assumeRole: [
        {
          roleArn: process.env.AWS_ROLE_ARN,
        },
      ],
    });

    const dataAwsVpcVpc = new aws.dataAwsVpc.DataAwsVpc(this, 'vpc', {
      filter: [
        {
          name: 'vpc-id',
          values: [options?.vpcId],
        },
      ],
    });

    new DbModule(this, 'aurora', {
      // NOSONAR
      auroraAllowedCidrBlocks: [dataAwsVpcVpc.cidrBlock],
      ...options,
    });
  }
}

const app = new App();

const getSubnetIds = () => {
  try {
    const subnetIds = process.env?.SUBNET_IDS || '';
    return JSON.parse(subnetIds);
  } catch (e) {
    console.error(e); // NOSONAR
  }
  return [];
};

new DbStack(app, 'db', {
  // NOSONAR
  auroraSubnets: getSubnetIds(),
  namespace: 'arc2',
  vpcId: process.env.VPC_ID || '',
  auroraAllowMajorVersionUpgrade: true,
  auroraAutoMinorVersionUpgrade: true,
  auroraClusterEnabled: true,
  auroraClusterName: 'aurora-examples',
  auroraClusterSize: 1,
  auroraDbAdminUsername: process.env.DB_USER || '',
  auroraDbName: 'example',
  auroraInstanceType: 'db.serverless',
  rdsInstancePubliclyAccessible: true,
  auroraServerlessv2ScalingConfiguration: {
    max_capacity: 16,
    min_capacity: 2,
  },
  enhancedMonitoringName: 'aurora-example-enhanced-monitoring',
  environment: process.env.ENV || 'dev',
  region: process.env.AWS_REGION,
  auroraDbAdminPassword: process.env.DB_PASSWORD,
});

app.synth();

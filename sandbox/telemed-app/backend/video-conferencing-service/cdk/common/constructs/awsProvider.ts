import * as aws from '@cdktf/provider-aws';
import {Construct} from 'constructs';

export class AwsProvider extends Construct {
  constructor(scope: Construct, name: string) {
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
  }
}

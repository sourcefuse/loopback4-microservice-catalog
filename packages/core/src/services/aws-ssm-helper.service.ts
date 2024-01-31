import {bind, BindingScope} from '@loopback/core';
import * as AWS from 'aws-sdk';

@bind({scope: BindingScope.TRANSIENT})
export class AwsSsmHelperService {
  /**
   *
   * @param ssmKeyParamName string (the key) for which value to be fetched from AWS ssm
   * @returns SSM Paramter Value
   */
  async getSSMParameterValue(ssmKeyParamName: string) {
    const ssm = new AWS.SSM({
      accessKeyId: process.env.AWS_ACCESS_ID,
      region: process.env.AWS_REGION,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    return await ssm
      .getParameter({
        Name: ssmKeyParamName,
        WithDecryption: true,
      })
      .promise();
  }
}

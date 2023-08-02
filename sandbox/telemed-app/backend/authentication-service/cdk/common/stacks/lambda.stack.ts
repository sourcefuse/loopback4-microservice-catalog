import * as random from '@cdktf/provider-random';
import {TerraformStack} from 'cdktf';
import {Construct} from 'constructs';
import {ILambdaWithApiGateway, LambdaWithApiGateway} from 'arc-cdk';
import {AwsProvider} from '../constructs/awsProvider';

export class LambdaStack extends TerraformStack {
  constructor(
    scope: Construct,
    id: string,
    config: Omit<ILambdaWithApiGateway, 'name'>,
  ) {
    super(scope, id);

    new AwsProvider(this, 'aws'); // NOSONAR
    new random.provider.RandomProvider(this, 'random'); // NOSONAR

    // Create random value
    const pet = new random.pet.Pet(this, 'random-name', {
      length: 2,
    });

    new LambdaWithApiGateway(this, 'lambda-apiGateway', {// NOSONAR
      ...config,
      name: pet.id,
    });
  }
}

import * as random from '@cdktf/provider-random';
import {TerraformStack} from 'cdktf';
import {Construct} from 'constructs';
import {ILambda, Lambda} from 'arc-cdk';
import {AwsProvider} from '../constructs/awsProvider';

export class MigrationStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: Omit<ILambda, 'name'>) {
    super(scope, id);

    new AwsProvider(this, 'aws'); // NOSONAR
    new random.provider.RandomProvider(this, 'random'); // NOSONAR

    // Create random value
    const pet = new random.pet.Pet(this, 'random-name', {
      length: 2,
    });

    new Lambda(this, 'lambda', {
      // NOSONAR
      ...config,
      name: pet.id,
    });
  }
}

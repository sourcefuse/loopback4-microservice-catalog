import * as random from '@cdktf/provider-random';
import {ILambda, Lambda} from 'arc-cdk';
import {TerraformStack} from 'cdktf';
import {Construct} from 'constructs';
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
    // sonarignore:start
    new Lambda(this, 'lambda', {
      // sonarignore:end
      ...config,
      name: pet.id,
    });
  }
}

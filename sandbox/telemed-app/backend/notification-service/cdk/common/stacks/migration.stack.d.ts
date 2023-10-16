import {TerraformStack} from 'cdktf';
import {Construct} from 'constructs';
import {ILambda} from 'arc-cdk';
export declare class MigrationStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: Omit<ILambda, 'name'>);
}

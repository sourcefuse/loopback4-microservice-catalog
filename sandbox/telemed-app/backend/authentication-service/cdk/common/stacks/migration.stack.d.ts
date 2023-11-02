import {ILambda} from 'arc-cdk';
import {TerraformStack} from 'cdktf';
import {Construct} from 'constructs';
export declare class MigrationStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: Omit<ILambda, 'name'>);
}

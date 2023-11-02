import {ILambdaWithApiGateway} from 'arc-cdk';
import {TerraformStack} from 'cdktf';
import {Construct} from 'constructs';
export declare class LambdaStack extends TerraformStack {
  constructor(
    scope: Construct,
    id: string,
    config: Omit<ILambdaWithApiGateway, 'name'>,
  );
}

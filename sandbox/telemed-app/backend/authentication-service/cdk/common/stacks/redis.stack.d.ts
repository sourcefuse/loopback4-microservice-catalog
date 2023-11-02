import {TerraformStack} from 'cdktf';
import {Construct} from 'constructs';
declare type Config = {
  namespace: string;
  environment: string;
};
export declare class RedisStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: Config);
}
export {};

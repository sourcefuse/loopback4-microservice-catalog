// https://cdk.tf/testing
import {AcmCertificate} from '@cdktf/provider-aws/lib/acm-certificate';
import {AcmCertificateValidation} from '@cdktf/provider-aws/lib/acm-certificate-validation';
import {Apigatewayv2Api} from '@cdktf/provider-aws/lib/apigatewayv2-api';
import {Apigatewayv2ApiMapping} from '@cdktf/provider-aws/lib/apigatewayv2-api-mapping';
import {Apigatewayv2DomainName} from '@cdktf/provider-aws/lib/apigatewayv2-domain-name';
import {IamPolicy} from '@cdktf/provider-aws/lib/iam-policy';
import {IamRole} from '@cdktf/provider-aws/lib/iam-role';
import {IamRolePolicyAttachment} from '@cdktf/provider-aws/lib/iam-role-policy-attachment';
import {
  LambdaFunction,
  LambdaFunctionConfig,
} from '@cdktf/provider-aws/lib/lambda-function';
import {LambdaLayerVersion} from '@cdktf/provider-aws/lib/lambda-layer-version';
import {LambdaPermission} from '@cdktf/provider-aws/lib/lambda-permission';
import {Route53Record} from '@cdktf/provider-aws/lib/route53-record';
import {Pet} from '@cdktf/provider-random/lib/pet';
import {Testing} from 'cdktf';
import 'cdktf/lib/testing/adapters/jest'; // Load types for expect matchers
import {LambdaStack} from '../common';
import {defaultLambdaMemory} from '../common/utils/constants';

expect.addSnapshotSerializer({
  test: val => typeof val === 'string',
  print: val => {
    if (typeof val === 'string') {
      const newVal = val.replace(/[A-Z0-9]{32}/g, 'ABC123');
      return `${newVal}`;
    }
    return '';
  },
});

const handler = 'lambda.handler';
const runtime = 'nodejs16.x';
const version = 'v0.0.1';
const subnetIds = ['subnet-123456'];
const securityGroupIds = ['sg-123456'];
const lambdaMemorySize = 256;
const acmCertificateArn =
  'arn:aws:acm:us-east-1:123456789123:certificate/12345678-1234-1234-1234-123456789123';
const hostedZoneId = 'hostedZoneId';
const domainName = 'domainName';

describe('My CDKTF Application with all config set', () => {
  let config: LambdaFunctionConfig;
  let lambdaStack: LambdaStack;
  let stack: string;

  beforeEach(() => {
    config = {
      // Set up test config
      path: __dirname,
      handler,
      runtime,
      version,
      layerPath: __dirname,
      subnetIds,
      securityGroupIds,
      isApiRequired: true,
      memorySize: lambdaMemorySize,
      customDomainName: {
        acmCertificateArn,
        hostedZoneId,
        domainName,
      },
    };

    const app = Testing.app();
    lambdaStack = new LambdaStack(app, 'test', config);
    stack = Testing.synth(lambdaStack);
  });

  it('should create the expected number of resources', () => {
    expect(stack).toHaveResourceWithProperties(LambdaFunction, {
      vpc_config: {
        security_group_ids: securityGroupIds,
        subnet_ids: subnetIds,
      },
      memory_size: lambdaMemorySize,
    });
    expect(stack).toHaveResource(IamRole);
    expect(stack).toHaveResource(LambdaLayerVersion);
    expect(stack).toHaveResource(IamPolicy);
    expect(stack).toHaveResource(IamRolePolicyAttachment);
    expect(stack).toHaveResource(Apigatewayv2Api);
    expect(stack).toHaveResource(LambdaPermission);
    expect(stack).toHaveResourceWithProperties(Pet, {length: 2});
    expect(stack).toHaveResourceWithProperties(Apigatewayv2DomainName, {
      domain_name: domainName,
    });
    expect(stack).toHaveResource(Apigatewayv2ApiMapping);
    expect(stack).toHaveResourceWithProperties(Route53Record, {
      zone_id: hostedZoneId,
    });
  });

  it('should match snapshot test', () => {
    expect(stack).toMatchSnapshot();
  });

  it('check if the produced terraform configuration is valid', () => {
    expect(Testing.fullSynth(lambdaStack)).toBeValidTerraform();
  });

  it('check if the produced terraform configuration is planing successfully', () => {
    expect(Testing.fullSynth(lambdaStack)).toPlanSuccessfully();
  });
});

describe('My CDKTF Application with config change', () => {
  it('should not create vpc if subnetIds and securityGroupIds are not provided', () => {
    const config = {
      path: __dirname,
      handler,
      runtime,
      version,
      layerPath: __dirname,
      isApiRequired: true,
    };
    const app = Testing.app();
    const lambdaStack = new LambdaStack(app, 'test', config);
    const stack = Testing.synth(lambdaStack);
    expect(stack).toHaveResource(LambdaFunction);
    expect(stack).not.toHaveResourceWithProperties(LambdaFunction, {
      vpc_config: {
        security_group_ids: securityGroupIds,
        subnet_ids: subnetIds,
      },
      memory_size: defaultLambdaMemory,
    });
    expect(stack).toHaveResource(Apigatewayv2Api);
    expect(stack).toHaveResource(LambdaLayerVersion);
    expect(stack).toHaveResource(IamPolicy);
    expect(stack).toHaveResource(IamRolePolicyAttachment);
    expect(stack).toHaveResource(LambdaPermission);
    expect(stack).toHaveResourceWithProperties(Pet, {length: 2});
    expect(stack).toHaveResource(IamRole);
  });

  it('should not create api gateway if isApiRequired is false', () => {
    const config = {
      path: __dirname,
      handler,
      runtime,
      version,
      layerPath: __dirname,
      subnetIds,
      securityGroupIds,
      isApiRequired: false,
    };
    const app = Testing.app();
    const lambdaStack = new LambdaStack(app, 'test', config);
    const stack = Testing.synth(lambdaStack);
    expect(stack).toHaveResource(LambdaFunction);
    expect(stack).toHaveResource(IamRole);
    expect(stack).toHaveResource(LambdaLayerVersion);
    expect(stack).toHaveResource(IamPolicy);
    expect(stack).toHaveResource(IamRolePolicyAttachment);
    expect(stack).not.toHaveResource(Apigatewayv2Api);
    expect(stack).not.toHaveResource(LambdaPermission);
    expect(stack).toHaveResourceWithProperties(Pet, {length: 2});
  });

  it('should not create lambda layer if layer path is not set', () => {
    const config = {
      path: __dirname,
      handler,
      runtime,
      version,
      subnetIds,
      securityGroupIds,
      isApiRequired: true,
    };
    const app = Testing.app();
    const lambdaStack = new LambdaStack(app, 'test', config);
    const stack = Testing.synth(lambdaStack);
    expect(stack).toHaveResource(LambdaFunction);
    expect(stack).toHaveResource(IamRole);
    expect(stack).not.toHaveResource(LambdaLayerVersion);
    expect(stack).toHaveResource(IamPolicy);
    expect(stack).toHaveResource(IamRolePolicyAttachment);
    expect(stack).toHaveResource(Apigatewayv2Api);
    expect(stack).toHaveResource(LambdaPermission);
    expect(stack).toHaveResourceWithProperties(Pet, {length: 2});
    expect(stack).not.toHaveResource(Apigatewayv2DomainName);
    expect(stack).not.toHaveResource(Apigatewayv2ApiMapping);
    expect(stack).not.toHaveResource(Route53Record);
  });

  it("should create acm certificate if user doesn't provide one", () => {
    const config = {
      path: __dirname,
      handler,
      runtime,
      version,
      isApiRequired: true,
      customDomainName: {
        hostedZoneId,
        domainName,
      },
    };
    const app = Testing.app();
    const lambdaStack = new LambdaStack(app, 'test', config);
    const stack = Testing.synth(lambdaStack);
    expect(stack).toHaveResource(Apigatewayv2Api);
    expect(stack).toHaveResourceWithProperties(AcmCertificate, {
      domain_name: domainName,
    });
    expect(stack).toHaveResource(AcmCertificateValidation);
  });
});

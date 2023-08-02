import * as aws from '@cdktf/provider-aws';
import { Fn, TerraformIterator, TerraformStack } from 'cdktf';
import { Construct } from 'constructs';
import { Redis } from '../../.gen/modules/redis';
import { AwsProvider } from '../constructs/awsProvider';
import { getResourceName } from '../utils/helper';

type Config = {
  namespace: string;
  environment: string;
};

export class RedisStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: Config) {
    super(scope, id);

    new AwsProvider(this, 'aws');// NOSONAR

    const name = getResourceName({
      namespace: config.namespace,
      environment: config.environment,
      randomName: 'Redis-user',
    });

    const dataAwsVpcVpc = new aws.dataAwsVpc.DataAwsVpc(this, 'vpc', {
      filter: [
        {
          name: 'tag:Name',
          values: [`${config.namespace}-${config.environment}-vpc`],
        },
      ],
    });

    const dataAwsSecurityGroupsRedisUserSg =
      new aws.dataAwsSecurityGroups.DataAwsSecurityGroups(
        this,
        'redis_user_sg',
        {
          filter: [
            {
              name: 'tag:redis-user',
              values: ['yes'],
            },
            {
              name: 'vpc-id',
              values: [dataAwsVpcVpc.id],
            },
          ],
        },
      );

    const dataAwsSubnetsPrivate = new aws.dataAwsSubnets.DataAwsSubnets(
      this,
      'private',
      {
        filter: [
          {
            name: 'tag:Name',
            values: [
              `${config.namespace}-${config.environment}-privatesubnet-private-${process.env.AWS_REGION}a`,
              `${config.namespace}-${config.environment}-privatesubnet-private-${process.env.AWS_REGION}b`,
            ],
          },
          {
            name: 'vpc-id',
            values: [dataAwsVpcVpc.id],
          },
        ],
      },
    );

    const subnetsIterrator = TerraformIterator.fromList(
      Fn.toset(dataAwsSubnetsPrivate.ids),
    );

    const dataAwsSubnetSubnet = new aws.dataAwsSubnet.DataAwsSubnet(
      this,
      'subnet',
      {
        forEach: subnetsIterrator,
        id: subnetsIterrator.value,
      },
    );

    const securityGroup = new aws.securityGroup.SecurityGroup(
      this,
      "ec_security_group",
      {
        description: "Security Group for ElastiCache redis users",
        name,
        tags: {
          Name: name,
          "redis-user": "yes",
        },
        vpcId: dataAwsVpcVpc.id,
      }
    );
    const egressConfig = {
      description: "Rule to allow Redis users to access the Redis cluster",
      from_port: 0,
      ipv6_cidr_blocks: null,
      prefix_list_ids: null,
      protocol: "TCP",
      security_groups: null,
      self: null,
      to_port: 6379,
      cidr_blocks: `\${[for s in data.${dataAwsSubnetSubnet.terraformResourceType}.${dataAwsSubnetSubnet.friendlyUniqueId} : s.cidr_block]}`,
    };
    securityGroup.addOverride("egress", [egressConfig]);

    new Redis(this, 'redis', {// NOSONAR
      allowedSecurityGroupIds: dataAwsSecurityGroupsRedisUserSg.ids,
      applyImmediately: true,
      atRestEncryptionEnabled: true,
      description: 'Elasticache redis instance for ref arch devops infra',
      environment: config.environment,
      namespace: config.namespace,
      subnets: dataAwsSubnetsPrivate.ids,
      transitEncryptionEnabled: true,
      vpcId: dataAwsVpcVpc.id,
    });

  }
}

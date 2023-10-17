'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.RedisStack = void 0;
const aws = require('@cdktf/provider-aws');
const cdktf_1 = require('cdktf');
const redis_1 = require('../../.gen/modules/redis');
const awsProvider_1 = require('../constructs/awsProvider');
const helper_1 = require('../utils/helper');
class RedisStack extends cdktf_1.TerraformStack {
  constructor(scope, id, config) {
    super(scope, id);
    new awsProvider_1.AwsProvider(this, 'aws'); // NOSONAR
    const name = (0, helper_1.getResourceName)({
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
    const subnetsIterrator = cdktf_1.TerraformIterator.fromList(
      cdktf_1.Fn.toset(dataAwsSubnetsPrivate.ids),
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
      'ec_security_group',
      {
        description: 'Security Group for ElastiCache redis users',
        name,
        tags: {
          Name: name,
          'redis-user': 'yes',
        },
        vpcId: dataAwsVpcVpc.id,
      },
    );
    const egressConfig = {
      description: 'Rule to allow Redis users to access the Redis cluster',
      from_port: 0,
      ipv6_cidr_blocks: null,
      prefix_list_ids: null,
      protocol: 'TCP',
      security_groups: null,
      self: null,
      to_port: 6379,
      cidr_blocks: `\${[for s in data.${dataAwsSubnetSubnet.terraformResourceType}.${dataAwsSubnetSubnet.friendlyUniqueId} : s.cidr_block]}`,
    };
    securityGroup.addOverride('egress', [egressConfig]);
    // sonarignore:start
    new redis_1.Redis(this, 'redis', {
     // sonarignore:end
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
exports.RedisStack = RedisStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXMuc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWRpcy5zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBMkM7QUFDM0MsaUNBQTREO0FBRTVELG9EQUErQztBQUMvQywyREFBc0Q7QUFDdEQsNENBQWdEO0FBT2hELE1BQWEsVUFBVyxTQUFRLHNCQUFjO0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsTUFBYztRQUN0RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUkseUJBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFVO1FBRXhDLE1BQU0sSUFBSSxHQUFHLElBQUEsd0JBQWUsRUFBQztZQUMzQixTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVM7WUFDM0IsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXO1lBQy9CLFVBQVUsRUFBRSxZQUFZO1NBQ3pCLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUMvRCxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLE1BQU0sRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsV0FBVyxNQUFNLENBQUM7aUJBQzFEO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGdDQUFnQyxHQUNwQyxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsQ0FDakQsSUFBSSxFQUNKLGVBQWUsRUFDZjtZQUNFLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUM7aUJBQ2hCO2dCQUNEO29CQUNFLElBQUksRUFBRSxRQUFRO29CQUNkLE1BQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7aUJBQzNCO2FBQ0Y7U0FDRixDQUNGLENBQUM7UUFFSixNQUFNLHFCQUFxQixHQUFHLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQ2pFLElBQUksRUFDSixTQUFTLEVBQ1Q7WUFDRSxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLE1BQU0sRUFBRTt3QkFDTixHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFdBQVcsMEJBQTBCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHO3dCQUM1RixHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFdBQVcsMEJBQTBCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHO3FCQUM3RjtpQkFDRjtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsUUFBUTtvQkFDZCxNQUFNLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO2lCQUMzQjthQUNGO1NBQ0YsQ0FDRixDQUFDO1FBRUYsTUFBTSxnQkFBZ0IsR0FBRyx5QkFBaUIsQ0FBQyxRQUFRLENBQ2pELFVBQUUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQ3BDLENBQUM7UUFFRixNQUFNLG1CQUFtQixHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQzdELElBQUksRUFDSixRQUFRLEVBQ1I7WUFDRSxPQUFPLEVBQUUsZ0JBQWdCO1lBQ3pCLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLO1NBQzNCLENBQ0YsQ0FBQztRQUVGLE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQ3ZELElBQUksRUFDSixtQkFBbUIsRUFDbkI7WUFDRSxXQUFXLEVBQUUsNENBQTRDO1lBQ3pELElBQUk7WUFDSixJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLElBQUk7Z0JBQ1YsWUFBWSxFQUFFLEtBQUs7YUFDcEI7WUFDRCxLQUFLLEVBQUUsYUFBYSxDQUFDLEVBQUU7U0FDeEIsQ0FDRixDQUFDO1FBQ0YsTUFBTSxZQUFZLEdBQUc7WUFDbkIsV0FBVyxFQUFFLHVEQUF1RDtZQUNwRSxTQUFTLEVBQUUsQ0FBQztZQUNaLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsZUFBZSxFQUFFLElBQUk7WUFDckIsUUFBUSxFQUFFLEtBQUs7WUFDZixlQUFlLEVBQUUsSUFBSTtZQUNyQixJQUFJLEVBQUUsSUFBSTtZQUNWLE9BQU8sRUFBRSxJQUFJO1lBQ2IsV0FBVyxFQUFFLHFCQUFxQixtQkFBbUIsQ0FBQyxxQkFBcUIsSUFBSSxtQkFBbUIsQ0FBQyxnQkFBZ0IsbUJBQW1CO1NBQ3ZJLENBQUM7UUFDRixhQUFhLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFFcEQsSUFBSSxhQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUN2QixVQUFVO1lBQ1YsdUJBQXVCLEVBQUUsZ0NBQWdDLENBQUMsR0FBRztZQUM3RCxnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLHVCQUF1QixFQUFFLElBQUk7WUFDN0IsV0FBVyxFQUFFLHNEQUFzRDtZQUNuRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVc7WUFDL0IsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTO1lBQzNCLE9BQU8sRUFBRSxxQkFBcUIsQ0FBQyxHQUFHO1lBQ2xDLHdCQUF3QixFQUFFLElBQUk7WUFDOUIsS0FBSyxFQUFFLGFBQWEsQ0FBQyxFQUFFO1NBQ3hCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQS9HRCxnQ0ErR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhd3MgZnJvbSAnQGNka3RmL3Byb3ZpZGVyLWF3cyc7XG5pbXBvcnQge0ZuLCBUZXJyYWZvcm1JdGVyYXRvciwgVGVycmFmb3JtU3RhY2t9IGZyb20gJ2Nka3RmJztcbmltcG9ydCB7Q29uc3RydWN0fSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7UmVkaXN9IGZyb20gJy4uLy4uLy5nZW4vbW9kdWxlcy9yZWRpcyc7XG5pbXBvcnQge0F3c1Byb3ZpZGVyfSBmcm9tICcuLi9jb25zdHJ1Y3RzL2F3c1Byb3ZpZGVyJztcbmltcG9ydCB7Z2V0UmVzb3VyY2VOYW1lfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuXG50eXBlIENvbmZpZyA9IHtcbiAgbmFtZXNwYWNlOiBzdHJpbmc7XG4gIGVudmlyb25tZW50OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgY2xhc3MgUmVkaXNTdGFjayBleHRlbmRzIFRlcnJhZm9ybVN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgbmV3IEF3c1Byb3ZpZGVyKHRoaXMsICdhd3MnKTsgLy8gTk9TT05BUlxuXG4gICAgY29uc3QgbmFtZSA9IGdldFJlc291cmNlTmFtZSh7XG4gICAgICBuYW1lc3BhY2U6IGNvbmZpZy5uYW1lc3BhY2UsXG4gICAgICBlbnZpcm9ubWVudDogY29uZmlnLmVudmlyb25tZW50LFxuICAgICAgcmFuZG9tTmFtZTogJ1JlZGlzLXVzZXInLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZGF0YUF3c1ZwY1ZwYyA9IG5ldyBhd3MuZGF0YUF3c1ZwYy5EYXRhQXdzVnBjKHRoaXMsICd2cGMnLCB7XG4gICAgICBmaWx0ZXI6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICd0YWc6TmFtZScsXG4gICAgICAgICAgdmFsdWVzOiBbYCR7Y29uZmlnLm5hbWVzcGFjZX0tJHtjb25maWcuZW52aXJvbm1lbnR9LXZwY2BdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRhdGFBd3NTZWN1cml0eUdyb3Vwc1JlZGlzVXNlclNnID1cbiAgICAgIG5ldyBhd3MuZGF0YUF3c1NlY3VyaXR5R3JvdXBzLkRhdGFBd3NTZWN1cml0eUdyb3VwcyhcbiAgICAgICAgdGhpcyxcbiAgICAgICAgJ3JlZGlzX3VzZXJfc2cnLFxuICAgICAgICB7XG4gICAgICAgICAgZmlsdGVyOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICd0YWc6cmVkaXMtdXNlcicsXG4gICAgICAgICAgICAgIHZhbHVlczogWyd5ZXMnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICd2cGMtaWQnLFxuICAgICAgICAgICAgICB2YWx1ZXM6IFtkYXRhQXdzVnBjVnBjLmlkXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICk7XG5cbiAgICBjb25zdCBkYXRhQXdzU3VibmV0c1ByaXZhdGUgPSBuZXcgYXdzLmRhdGFBd3NTdWJuZXRzLkRhdGFBd3NTdWJuZXRzKFxuICAgICAgdGhpcyxcbiAgICAgICdwcml2YXRlJyxcbiAgICAgIHtcbiAgICAgICAgZmlsdGVyOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3RhZzpOYW1lJyxcbiAgICAgICAgICAgIHZhbHVlczogW1xuICAgICAgICAgICAgICBgJHtjb25maWcubmFtZXNwYWNlfS0ke2NvbmZpZy5lbnZpcm9ubWVudH0tcHJpdmF0ZXN1Ym5ldC1wcml2YXRlLSR7cHJvY2Vzcy5lbnYuQVdTX1JFR0lPTn1hYCxcbiAgICAgICAgICAgICAgYCR7Y29uZmlnLm5hbWVzcGFjZX0tJHtjb25maWcuZW52aXJvbm1lbnR9LXByaXZhdGVzdWJuZXQtcHJpdmF0ZS0ke3Byb2Nlc3MuZW52LkFXU19SRUdJT059YmAsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3ZwYy1pZCcsXG4gICAgICAgICAgICB2YWx1ZXM6IFtkYXRhQXdzVnBjVnBjLmlkXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICApO1xuXG4gICAgY29uc3Qgc3VibmV0c0l0ZXJyYXRvciA9IFRlcnJhZm9ybUl0ZXJhdG9yLmZyb21MaXN0KFxuICAgICAgRm4udG9zZXQoZGF0YUF3c1N1Ym5ldHNQcml2YXRlLmlkcyksXG4gICAgKTtcblxuICAgIGNvbnN0IGRhdGFBd3NTdWJuZXRTdWJuZXQgPSBuZXcgYXdzLmRhdGFBd3NTdWJuZXQuRGF0YUF3c1N1Ym5ldChcbiAgICAgIHRoaXMsXG4gICAgICAnc3VibmV0JyxcbiAgICAgIHtcbiAgICAgICAgZm9yRWFjaDogc3VibmV0c0l0ZXJyYXRvcixcbiAgICAgICAgaWQ6IHN1Ym5ldHNJdGVycmF0b3IudmFsdWUsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBjb25zdCBzZWN1cml0eUdyb3VwID0gbmV3IGF3cy5zZWN1cml0eUdyb3VwLlNlY3VyaXR5R3JvdXAoXG4gICAgICB0aGlzLFxuICAgICAgJ2VjX3NlY3VyaXR5X2dyb3VwJyxcbiAgICAgIHtcbiAgICAgICAgZGVzY3JpcHRpb246ICdTZWN1cml0eSBHcm91cCBmb3IgRWxhc3RpQ2FjaGUgcmVkaXMgdXNlcnMnLFxuICAgICAgICBuYW1lLFxuICAgICAgICB0YWdzOiB7XG4gICAgICAgICAgTmFtZTogbmFtZSxcbiAgICAgICAgICAncmVkaXMtdXNlcic6ICd5ZXMnLFxuICAgICAgICB9LFxuICAgICAgICB2cGNJZDogZGF0YUF3c1ZwY1ZwYy5pZCxcbiAgICAgIH0sXG4gICAgKTtcbiAgICBjb25zdCBlZ3Jlc3NDb25maWcgPSB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1J1bGUgdG8gYWxsb3cgUmVkaXMgdXNlcnMgdG8gYWNjZXNzIHRoZSBSZWRpcyBjbHVzdGVyJyxcbiAgICAgIGZyb21fcG9ydDogMCxcbiAgICAgIGlwdjZfY2lkcl9ibG9ja3M6IG51bGwsXG4gICAgICBwcmVmaXhfbGlzdF9pZHM6IG51bGwsXG4gICAgICBwcm90b2NvbDogJ1RDUCcsXG4gICAgICBzZWN1cml0eV9ncm91cHM6IG51bGwsXG4gICAgICBzZWxmOiBudWxsLFxuICAgICAgdG9fcG9ydDogNjM3OSxcbiAgICAgIGNpZHJfYmxvY2tzOiBgXFwke1tmb3IgcyBpbiBkYXRhLiR7ZGF0YUF3c1N1Ym5ldFN1Ym5ldC50ZXJyYWZvcm1SZXNvdXJjZVR5cGV9LiR7ZGF0YUF3c1N1Ym5ldFN1Ym5ldC5mcmllbmRseVVuaXF1ZUlkfSA6IHMuY2lkcl9ibG9ja119YCxcbiAgICB9O1xuICAgIHNlY3VyaXR5R3JvdXAuYWRkT3ZlcnJpZGUoJ2VncmVzcycsIFtlZ3Jlc3NDb25maWddKTtcblxuICAgIG5ldyBSZWRpcyh0aGlzLCAncmVkaXMnLCB7XG4gICAgICAvLyBOT1NPTkFSXG4gICAgICBhbGxvd2VkU2VjdXJpdHlHcm91cElkczogZGF0YUF3c1NlY3VyaXR5R3JvdXBzUmVkaXNVc2VyU2cuaWRzLFxuICAgICAgYXBwbHlJbW1lZGlhdGVseTogdHJ1ZSxcbiAgICAgIGF0UmVzdEVuY3J5cHRpb25FbmFibGVkOiB0cnVlLFxuICAgICAgZGVzY3JpcHRpb246ICdFbGFzdGljYWNoZSByZWRpcyBpbnN0YW5jZSBmb3IgcmVmIGFyY2ggZGV2b3BzIGluZnJhJyxcbiAgICAgIGVudmlyb25tZW50OiBjb25maWcuZW52aXJvbm1lbnQsXG4gICAgICBuYW1lc3BhY2U6IGNvbmZpZy5uYW1lc3BhY2UsXG4gICAgICBzdWJuZXRzOiBkYXRhQXdzU3VibmV0c1ByaXZhdGUuaWRzLFxuICAgICAgdHJhbnNpdEVuY3J5cHRpb25FbmFibGVkOiB0cnVlLFxuICAgICAgdnBjSWQ6IGRhdGFBd3NWcGNWcGMuaWQsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==

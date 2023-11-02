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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXMuc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWRpcy5zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBMkM7QUFDM0MsaUNBQTREO0FBRTVELG9EQUErQztBQUMvQywyREFBc0Q7QUFDdEQsNENBQWdEO0FBT2hELE1BQWEsVUFBVyxTQUFRLHNCQUFjO0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsTUFBYztRQUN0RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUkseUJBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFVO1FBRXhDLE1BQU0sSUFBSSxHQUFHLElBQUEsd0JBQWUsRUFBQztZQUMzQixTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVM7WUFDM0IsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXO1lBQy9CLFVBQVUsRUFBRSxZQUFZO1NBQ3pCLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUMvRCxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLE1BQU0sRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsV0FBVyxNQUFNLENBQUM7aUJBQzFEO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGdDQUFnQyxHQUNwQyxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsQ0FDakQsSUFBSSxFQUNKLGVBQWUsRUFDZjtZQUNFLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUM7aUJBQ2hCO2dCQUNEO29CQUNFLElBQUksRUFBRSxRQUFRO29CQUNkLE1BQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7aUJBQzNCO2FBQ0Y7U0FDRixDQUNGLENBQUM7UUFFSixNQUFNLHFCQUFxQixHQUFHLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQ2pFLElBQUksRUFDSixTQUFTLEVBQ1Q7WUFDRSxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLE1BQU0sRUFBRTt3QkFDTixHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFdBQVcsMEJBQTBCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHO3dCQUM1RixHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFdBQVcsMEJBQTBCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHO3FCQUM3RjtpQkFDRjtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsUUFBUTtvQkFDZCxNQUFNLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO2lCQUMzQjthQUNGO1NBQ0YsQ0FDRixDQUFDO1FBRUYsTUFBTSxnQkFBZ0IsR0FBRyx5QkFBaUIsQ0FBQyxRQUFRLENBQ2pELFVBQUUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQ3BDLENBQUM7UUFFRixNQUFNLG1CQUFtQixHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQzdELElBQUksRUFDSixRQUFRLEVBQ1I7WUFDRSxPQUFPLEVBQUUsZ0JBQWdCO1lBQ3pCLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLO1NBQzNCLENBQ0YsQ0FBQztRQUVGLE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQ3ZELElBQUksRUFDSixtQkFBbUIsRUFDbkI7WUFDRSxXQUFXLEVBQUUsNENBQTRDO1lBQ3pELElBQUk7WUFDSixJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLElBQUk7Z0JBQ1YsWUFBWSxFQUFFLEtBQUs7YUFDcEI7WUFDRCxLQUFLLEVBQUUsYUFBYSxDQUFDLEVBQUU7U0FDeEIsQ0FDRixDQUFDO1FBQ0YsTUFBTSxZQUFZLEdBQUc7WUFDbkIsV0FBVyxFQUFFLHVEQUF1RDtZQUNwRSxTQUFTLEVBQUUsQ0FBQztZQUNaLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsZUFBZSxFQUFFLElBQUk7WUFDckIsUUFBUSxFQUFFLEtBQUs7WUFDZixlQUFlLEVBQUUsSUFBSTtZQUNyQixJQUFJLEVBQUUsSUFBSTtZQUNWLE9BQU8sRUFBRSxJQUFJO1lBQ2IsV0FBVyxFQUFFLHFCQUFxQixtQkFBbUIsQ0FBQyxxQkFBcUIsSUFBSSxtQkFBbUIsQ0FBQyxnQkFBZ0IsbUJBQW1CO1NBQ3ZJLENBQUM7UUFDRixhQUFhLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDcEQsb0JBQW9CO1FBQ3BCLElBQUksYUFBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDdkIsa0JBQWtCO1lBQ2xCLHVCQUF1QixFQUFFLGdDQUFnQyxDQUFDLEdBQUc7WUFDN0QsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0Qix1QkFBdUIsRUFBRSxJQUFJO1lBQzdCLFdBQVcsRUFBRSxzREFBc0Q7WUFDbkUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXO1lBQy9CLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUztZQUMzQixPQUFPLEVBQUUscUJBQXFCLENBQUMsR0FBRztZQUNsQyx3QkFBd0IsRUFBRSxJQUFJO1lBQzlCLEtBQUssRUFBRSxhQUFhLENBQUMsRUFBRTtTQUN4QixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUEvR0QsZ0NBK0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXdzIGZyb20gJ0BjZGt0Zi9wcm92aWRlci1hd3MnO1xuaW1wb3J0IHtGbiwgVGVycmFmb3JtSXRlcmF0b3IsIFRlcnJhZm9ybVN0YWNrfSBmcm9tICdjZGt0Zic7XG5pbXBvcnQge0NvbnN0cnVjdH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQge1JlZGlzfSBmcm9tICcuLi8uLi8uZ2VuL21vZHVsZXMvcmVkaXMnO1xuaW1wb3J0IHtBd3NQcm92aWRlcn0gZnJvbSAnLi4vY29uc3RydWN0cy9hd3NQcm92aWRlcic7XG5pbXBvcnQge2dldFJlc291cmNlTmFtZX0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcblxudHlwZSBDb25maWcgPSB7XG4gIG5hbWVzcGFjZTogc3RyaW5nO1xuICBlbnZpcm9ubWVudDogc3RyaW5nO1xufTtcblxuZXhwb3J0IGNsYXNzIFJlZGlzU3RhY2sgZXh0ZW5kcyBUZXJyYWZvcm1TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIG5ldyBBd3NQcm92aWRlcih0aGlzLCAnYXdzJyk7IC8vIE5PU09OQVJcblxuICAgIGNvbnN0IG5hbWUgPSBnZXRSZXNvdXJjZU5hbWUoe1xuICAgICAgbmFtZXNwYWNlOiBjb25maWcubmFtZXNwYWNlLFxuICAgICAgZW52aXJvbm1lbnQ6IGNvbmZpZy5lbnZpcm9ubWVudCxcbiAgICAgIHJhbmRvbU5hbWU6ICdSZWRpcy11c2VyJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRhdGFBd3NWcGNWcGMgPSBuZXcgYXdzLmRhdGFBd3NWcGMuRGF0YUF3c1ZwYyh0aGlzLCAndnBjJywge1xuICAgICAgZmlsdGVyOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAndGFnOk5hbWUnLFxuICAgICAgICAgIHZhbHVlczogW2Ake2NvbmZpZy5uYW1lc3BhY2V9LSR7Y29uZmlnLmVudmlyb25tZW50fS12cGNgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBkYXRhQXdzU2VjdXJpdHlHcm91cHNSZWRpc1VzZXJTZyA9XG4gICAgICBuZXcgYXdzLmRhdGFBd3NTZWN1cml0eUdyb3Vwcy5EYXRhQXdzU2VjdXJpdHlHcm91cHMoXG4gICAgICAgIHRoaXMsXG4gICAgICAgICdyZWRpc191c2VyX3NnJyxcbiAgICAgICAge1xuICAgICAgICAgIGZpbHRlcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAndGFnOnJlZGlzLXVzZXInLFxuICAgICAgICAgICAgICB2YWx1ZXM6IFsneWVzJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAndnBjLWlkJyxcbiAgICAgICAgICAgICAgdmFsdWVzOiBbZGF0YUF3c1ZwY1ZwYy5pZF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICApO1xuXG4gICAgY29uc3QgZGF0YUF3c1N1Ym5ldHNQcml2YXRlID0gbmV3IGF3cy5kYXRhQXdzU3VibmV0cy5EYXRhQXdzU3VibmV0cyhcbiAgICAgIHRoaXMsXG4gICAgICAncHJpdmF0ZScsXG4gICAgICB7XG4gICAgICAgIGZpbHRlcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd0YWc6TmFtZScsXG4gICAgICAgICAgICB2YWx1ZXM6IFtcbiAgICAgICAgICAgICAgYCR7Y29uZmlnLm5hbWVzcGFjZX0tJHtjb25maWcuZW52aXJvbm1lbnR9LXByaXZhdGVzdWJuZXQtcHJpdmF0ZS0ke3Byb2Nlc3MuZW52LkFXU19SRUdJT059YWAsXG4gICAgICAgICAgICAgIGAke2NvbmZpZy5uYW1lc3BhY2V9LSR7Y29uZmlnLmVudmlyb25tZW50fS1wcml2YXRlc3VibmV0LXByaXZhdGUtJHtwcm9jZXNzLmVudi5BV1NfUkVHSU9OfWJgLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd2cGMtaWQnLFxuICAgICAgICAgICAgdmFsdWVzOiBbZGF0YUF3c1ZwY1ZwYy5pZF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIGNvbnN0IHN1Ym5ldHNJdGVycmF0b3IgPSBUZXJyYWZvcm1JdGVyYXRvci5mcm9tTGlzdChcbiAgICAgIEZuLnRvc2V0KGRhdGFBd3NTdWJuZXRzUHJpdmF0ZS5pZHMpLFxuICAgICk7XG5cbiAgICBjb25zdCBkYXRhQXdzU3VibmV0U3VibmV0ID0gbmV3IGF3cy5kYXRhQXdzU3VibmV0LkRhdGFBd3NTdWJuZXQoXG4gICAgICB0aGlzLFxuICAgICAgJ3N1Ym5ldCcsXG4gICAgICB7XG4gICAgICAgIGZvckVhY2g6IHN1Ym5ldHNJdGVycmF0b3IsXG4gICAgICAgIGlkOiBzdWJuZXRzSXRlcnJhdG9yLnZhbHVlLFxuICAgICAgfSxcbiAgICApO1xuXG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IG5ldyBhd3Muc2VjdXJpdHlHcm91cC5TZWN1cml0eUdyb3VwKFxuICAgICAgdGhpcyxcbiAgICAgICdlY19zZWN1cml0eV9ncm91cCcsXG4gICAgICB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiAnU2VjdXJpdHkgR3JvdXAgZm9yIEVsYXN0aUNhY2hlIHJlZGlzIHVzZXJzJyxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdGFnczoge1xuICAgICAgICAgIE5hbWU6IG5hbWUsXG4gICAgICAgICAgJ3JlZGlzLXVzZXInOiAneWVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgdnBjSWQ6IGRhdGFBd3NWcGNWcGMuaWQsXG4gICAgICB9LFxuICAgICk7XG4gICAgY29uc3QgZWdyZXNzQ29uZmlnID0ge1xuICAgICAgZGVzY3JpcHRpb246ICdSdWxlIHRvIGFsbG93IFJlZGlzIHVzZXJzIHRvIGFjY2VzcyB0aGUgUmVkaXMgY2x1c3RlcicsXG4gICAgICBmcm9tX3BvcnQ6IDAsXG4gICAgICBpcHY2X2NpZHJfYmxvY2tzOiBudWxsLFxuICAgICAgcHJlZml4X2xpc3RfaWRzOiBudWxsLFxuICAgICAgcHJvdG9jb2w6ICdUQ1AnLFxuICAgICAgc2VjdXJpdHlfZ3JvdXBzOiBudWxsLFxuICAgICAgc2VsZjogbnVsbCxcbiAgICAgIHRvX3BvcnQ6IDYzNzksXG4gICAgICBjaWRyX2Jsb2NrczogYFxcJHtbZm9yIHMgaW4gZGF0YS4ke2RhdGFBd3NTdWJuZXRTdWJuZXQudGVycmFmb3JtUmVzb3VyY2VUeXBlfS4ke2RhdGFBd3NTdWJuZXRTdWJuZXQuZnJpZW5kbHlVbmlxdWVJZH0gOiBzLmNpZHJfYmxvY2tdfWAsXG4gICAgfTtcbiAgICBzZWN1cml0eUdyb3VwLmFkZE92ZXJyaWRlKCdlZ3Jlc3MnLCBbZWdyZXNzQ29uZmlnXSk7XG4gICAgLy8gc29uYXJpZ25vcmU6c3RhcnRcbiAgICBuZXcgUmVkaXModGhpcywgJ3JlZGlzJywge1xuICAgICAgLy8gc29uYXJpZ25vcmU6ZW5kXG4gICAgICBhbGxvd2VkU2VjdXJpdHlHcm91cElkczogZGF0YUF3c1NlY3VyaXR5R3JvdXBzUmVkaXNVc2VyU2cuaWRzLFxuICAgICAgYXBwbHlJbW1lZGlhdGVseTogdHJ1ZSxcbiAgICAgIGF0UmVzdEVuY3J5cHRpb25FbmFibGVkOiB0cnVlLFxuICAgICAgZGVzY3JpcHRpb246ICdFbGFzdGljYWNoZSByZWRpcyBpbnN0YW5jZSBmb3IgcmVmIGFyY2ggZGV2b3BzIGluZnJhJyxcbiAgICAgIGVudmlyb25tZW50OiBjb25maWcuZW52aXJvbm1lbnQsXG4gICAgICBuYW1lc3BhY2U6IGNvbmZpZy5uYW1lc3BhY2UsXG4gICAgICBzdWJuZXRzOiBkYXRhQXdzU3VibmV0c1ByaXZhdGUuaWRzLFxuICAgICAgdHJhbnNpdEVuY3J5cHRpb25FbmFibGVkOiB0cnVlLFxuICAgICAgdnBjSWQ6IGRhdGFBd3NWcGNWcGMuaWQsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==

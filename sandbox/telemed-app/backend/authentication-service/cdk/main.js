'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
const cdktf_1 = require('cdktf');
const dotenv = require('dotenv');
const dotenvExt = require('dotenv-extended');
const path_1 = require('path');
const common_1 = require('./common');
dotenv.config();
dotenvExt.load({
  schema: '.env.example',
  errorOnMissing: true,
  includeProcessEnv: true,
});
const app = new cdktf_1.App();
const getSubnetIds = () => {
  let _a;
  try {
    const subnetIds =
      ((_a = process.env) === null || _a === void 0 ? void 0 : _a.SUBNET_IDS) ||
      '';
    return JSON.parse(subnetIds);
  } catch (e) {
    console.error(e); // NOSONAR
  }
  return [];
};
const getSecurityGroup = () => {
  let _a;
  try {
    const securityGroup =
      ((_a = process.env) === null || _a === void 0
        ? void 0
        : _a.SECURITY_GROUPS) || '';
    return JSON.parse(securityGroup);
  } catch (e) {
    console.error(e); // NOSONAR
  }
  return [];
};
// sonarignore:start
new common_1.MigrationStack(app, 'migration', {
  // sonarignore:end
  codePath: (0, path_1.resolve)(__dirname, '../migration'),
  handler: 'lambda.handler',
  runtime: 'nodejs18.x',
  vpcConfig: {
    securityGroupIds: getSecurityGroup(),
    subnetIds: getSubnetIds(),
  },
  memorySize: 256,
  invocationData: '{}',
  timeout: 60,
  envVars: {
    DB_HOST: process.env.DB_HOST || '',
    DB_PORT: process.env.DB_PORT || '',
    DB_USER: process.env.DB_USER || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_DATABASE: process.env.DB_DATABASE || '',
  },
  namespace: process.env.NAMESPACE || '',
  environment: process.env.ENV || '',
});
// sonarignore:start
new common_1.LambdaStack(app, 'lambda', {
  // sonarignore:end
  s3Bucket: process.env.S3_BUCKET,
  codePath: __dirname,
  handler: 'lambda.handler',
  runtime: 'nodejs18.x',
  layerPath: (0, path_1.resolve)(__dirname, '../layers'),
  vpcConfig: {
    securityGroupIds: getSecurityGroup(),
    subnetIds: getSubnetIds(),
  },
  memorySize: 256,
  timeout: 30,
  customDomainName: {
    domainName: process.env.DOMAIN_NAME || '',
    hostedZoneId: process.env.HOSTED_ZONE_ID || '',
  },
  namespace: process.env.NAMESPACE || '',
  environment: process.env.ENV || '',
  createRole: {
    iamPolicy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
            'ec2:CreateNetworkInterface',
            'ec2:DescribeNetworkInterfaces',
            'ec2:DeleteNetworkInterface',
            'ec2:AssignPrivateIpAddresses',
            'ec2:UnassignPrivateIpAddresses',
            'secretsmanager:GetSecretValue',
          ],
          Resource: '*',
        },
      ],
    }),
    iamRole: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Principal: {
            Service: 'lambda.amazonaws.com',
          },
          Effect: 'Allow',
          Sid: '',
        },
      ],
    }),
  },
  useImage: true,
});
// sonarignore:start
new common_1.RedisStack(app, 'redis', {
  // sonarignore:end
  namespace: process.env.NAMESPACE || '',
  environment: process.env.ENV || '',
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBMEI7QUFDMUIsaUNBQWlDO0FBQ2pDLDZDQUE2QztBQUM3QywrQkFBNkI7QUFDN0IscUNBQWlFO0FBRWpFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoQixTQUFTLENBQUMsSUFBSSxDQUFDO0lBQ2IsTUFBTSxFQUFFLGNBQWM7SUFDdEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsaUJBQWlCLEVBQUUsSUFBSTtDQUN4QixDQUFDLENBQUM7QUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQUcsRUFBRSxDQUFDO0FBRXRCLE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRTs7SUFDeEIsSUFBSTtRQUNGLE1BQU0sU0FBUyxHQUFHLENBQUEsTUFBQSxPQUFPLENBQUMsR0FBRywwQ0FBRSxVQUFVLEtBQUksRUFBRSxDQUFDO1FBQ2hELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM5QjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVU7S0FDN0I7SUFDRCxPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUMsQ0FBQztBQUVGLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxFQUFFOztJQUM1QixJQUFJO1FBQ0YsTUFBTSxhQUFhLEdBQUcsQ0FBQSxNQUFBLE9BQU8sQ0FBQyxHQUFHLDBDQUFFLGVBQWUsS0FBSSxFQUFFLENBQUM7UUFDekQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ2xDO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVTtLQUM3QjtJQUNELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyxDQUFDO0FBQ0Ysb0JBQW9C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QUFDO0FBQ0gsb0JBQW9CO0FBQ3BCLElBQUksbUJBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO0lBQzNCLGtCQUFrQjtJQUNsQixTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksRUFBRTtJQUN0QyxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRTtDQUNuQyxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FwcH0gZnJvbSAnY2RrdGYnO1xuaW1wb3J0ICogYXMgZG90ZW52IGZyb20gJ2RvdGVudic7XG5pbXBvcnQgKiBhcyBkb3RlbnZFeHQgZnJvbSAnZG90ZW52LWV4dGVuZGVkJztcbmltcG9ydCB7cmVzb2x2ZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQge0xhbWJkYVN0YWNrLCBNaWdyYXRpb25TdGFjaywgUmVkaXNTdGFja30gZnJvbSAnLi9jb21tb24nO1xuXG5kb3RlbnYuY29uZmlnKCk7XG5kb3RlbnZFeHQubG9hZCh7XG4gIHNjaGVtYTogJy5lbnYuZXhhbXBsZScsXG4gIGVycm9yT25NaXNzaW5nOiB0cnVlLFxuICBpbmNsdWRlUHJvY2Vzc0VudjogdHJ1ZSxcbn0pO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IGdldFN1Ym5ldElkcyA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzdWJuZXRJZHMgPSBwcm9jZXNzLmVudj8uU1VCTkVUX0lEUyB8fCAnJztcbiAgICByZXR1cm4gSlNPTi5wYXJzZShzdWJuZXRJZHMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlKTsgLy8gTk9TT05BUlxuICB9XG4gIHJldHVybiBbXTtcbn07XG5cbmNvbnN0IGdldFNlY3VyaXR5R3JvdXAgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IHByb2Nlc3MuZW52Py5TRUNVUklUWV9HUk9VUFMgfHwgJyc7XG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc2VjdXJpdHlHcm91cCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUpOyAvLyBOT1NPTkFSXG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcbi8vIHNvbmFyaWdub3JlOnN0YXJ0XG5uZXcgTWlncmF0aW9uU3RhY2soYXBwLCAnbWlncmF0aW9uJywge1xuICAvLyBzb25hcmlnbm9yZTplbmRcbiAgY29kZVBhdGg6IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vbWlncmF0aW9uJyksXG4gIGhhbmRsZXI6ICdsYW1iZGEuaGFuZGxlcicsXG4gIHJ1bnRpbWU6ICdub2RlanMxOC54JyxcbiAgdnBjQ29uZmlnOiB7XG4gICAgc2VjdXJpdHlHcm91cElkczogZ2V0U2VjdXJpdHlHcm91cCgpLFxuICAgIHN1Ym5ldElkczogZ2V0U3VibmV0SWRzKCksXG4gIH0sXG4gIG1lbW9yeVNpemU6IDI1NixcbiAgaW52b2NhdGlvbkRhdGE6ICd7fScsXG4gIHRpbWVvdXQ6IDYwLFxuICBlbnZWYXJzOiB7XG4gICAgREJfSE9TVDogcHJvY2Vzcy5lbnYuREJfSE9TVCB8fCAnJyxcbiAgICBEQl9QT1JUOiBwcm9jZXNzLmVudi5EQl9QT1JUIHx8ICcnLFxuICAgIERCX1VTRVI6IHByb2Nlc3MuZW52LkRCX1VTRVIgfHwgJycsXG4gICAgREJfUEFTU1dPUkQ6IHByb2Nlc3MuZW52LkRCX1BBU1NXT1JEIHx8ICcnLFxuICAgIERCX0RBVEFCQVNFOiBwcm9jZXNzLmVudi5EQl9EQVRBQkFTRSB8fCAnJyxcbiAgfSxcbiAgbmFtZXNwYWNlOiBwcm9jZXNzLmVudi5OQU1FU1BBQ0UgfHwgJycsXG4gIGVudmlyb25tZW50OiBwcm9jZXNzLmVudi5FTlYgfHwgJycsXG59KTtcbi8vIHNvbmFyaWdub3JlOnN0YXJ0XG5uZXcgTGFtYmRhU3RhY2soYXBwLCAnbGFtYmRhJywge1xuICAvLyBzb25hcmlnbm9yZTplbmRcbiAgczNCdWNrZXQ6IHByb2Nlc3MuZW52LlMzX0JVQ0tFVCEsXG4gIGNvZGVQYXRoOiBfX2Rpcm5hbWUsXG4gIGhhbmRsZXI6ICdsYW1iZGEuaGFuZGxlcicsXG4gIHJ1bnRpbWU6ICdub2RlanMxOC54JyxcbiAgbGF5ZXJQYXRoOiByZXNvbHZlKF9fZGlybmFtZSwgJy4uL2xheWVycycpLFxuICB2cGNDb25maWc6IHtcbiAgICBzZWN1cml0eUdyb3VwSWRzOiBnZXRTZWN1cml0eUdyb3VwKCksXG4gICAgc3VibmV0SWRzOiBnZXRTdWJuZXRJZHMoKSxcbiAgfSxcbiAgbWVtb3J5U2l6ZTogMjU2LFxuICB0aW1lb3V0OiAzMCxcbiAgY3VzdG9tRG9tYWluTmFtZToge1xuICAgIGRvbWFpbk5hbWU6IHByb2Nlc3MuZW52LkRPTUFJTl9OQU1FIHx8ICcnLFxuICAgIGhvc3RlZFpvbmVJZDogcHJvY2Vzcy5lbnYuSE9TVEVEX1pPTkVfSUQgfHwgJycsXG4gIH0sXG4gIG5hbWVzcGFjZTogcHJvY2Vzcy5lbnYuTkFNRVNQQUNFIHx8ICcnLFxuICBlbnZpcm9ubWVudDogcHJvY2Vzcy5lbnYuRU5WIHx8ICcnLFxuICBjcmVhdGVSb2xlOiB7XG4gICAgaWFtUG9saWN5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ0dyb3VwJyxcbiAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICAgICAgJ2VjMjpDcmVhdGVOZXR3b3JrSW50ZXJmYWNlJyxcbiAgICAgICAgICAgICdlYzI6RGVzY3JpYmVOZXR3b3JrSW50ZXJmYWNlcycsXG4gICAgICAgICAgICAnZWMyOkRlbGV0ZU5ldHdvcmtJbnRlcmZhY2UnLFxuICAgICAgICAgICAgJ2VjMjpBc3NpZ25Qcml2YXRlSXBBZGRyZXNzZXMnLFxuICAgICAgICAgICAgJ2VjMjpVbmFzc2lnblByaXZhdGVJcEFkZHJlc3NlcycsXG4gICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSksXG4gICAgaWFtUm9sZTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICBTZXJ2aWNlOiAnbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFNpZDogJycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pLFxuICB9LFxuICB1c2VJbWFnZTogdHJ1ZSxcbn0pO1xuLy8gc29uYXJpZ25vcmU6c3RhcnRcbm5ldyBSZWRpc1N0YWNrKGFwcCwgJ3JlZGlzJywge1xuICAvLyBzb25hcmlnbm9yZTplbmRcbiAgbmFtZXNwYWNlOiBwcm9jZXNzLmVudi5OQU1FU1BBQ0UgfHwgJycsXG4gIGVudmlyb25tZW50OiBwcm9jZXNzLmVudi5FTlYgfHwgJycsXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=

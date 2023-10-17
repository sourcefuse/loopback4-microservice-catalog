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
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBMEI7QUFDMUIsaUNBQWlDO0FBQ2pDLDZDQUE2QztBQUM3QywrQkFBNkI7QUFDN0IscUNBQXFEO0FBRXJELE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoQixTQUFTLENBQUMsSUFBSSxDQUFDO0lBQ2IsTUFBTSxFQUFFLGNBQWM7SUFDdEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsaUJBQWlCLEVBQUUsSUFBSTtDQUN4QixDQUFDLENBQUM7QUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQUcsRUFBRSxDQUFDO0FBRXRCLE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRTs7SUFDeEIsSUFBSTtRQUNGLE1BQU0sU0FBUyxHQUFHLENBQUEsTUFBQSxPQUFPLENBQUMsR0FBRywwQ0FBRSxVQUFVLEtBQUksRUFBRSxDQUFDO1FBQ2hELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM5QjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVU7S0FDN0I7SUFDRCxPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUMsQ0FBQztBQUVGLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxFQUFFOztJQUM1QixJQUFJO1FBQ0YsTUFBTSxhQUFhLEdBQUcsQ0FBQSxNQUFBLE9BQU8sQ0FBQyxHQUFHLDBDQUFFLGVBQWUsS0FBSSxFQUFFLENBQUM7UUFDekQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ2xDO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVTtLQUM3QjtJQUNELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyxDQUFDO0FBRUYsSUFBSSx1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QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QXBwfSBmcm9tICdjZGt0Zic7XG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52JztcbmltcG9ydCAqIGFzIGRvdGVudkV4dCBmcm9tICdkb3RlbnYtZXh0ZW5kZWQnO1xuaW1wb3J0IHtyZXNvbHZlfSBmcm9tICdwYXRoJztcbmltcG9ydCB7TGFtYmRhU3RhY2ssIE1pZ3JhdGlvblN0YWNrfSBmcm9tICcuL2NvbW1vbic7XG5cbmRvdGVudi5jb25maWcoKTtcbmRvdGVudkV4dC5sb2FkKHtcbiAgc2NoZW1hOiAnLmVudi5leGFtcGxlJyxcbiAgZXJyb3JPbk1pc3Npbmc6IHRydWUsXG4gIGluY2x1ZGVQcm9jZXNzRW52OiB0cnVlLFxufSk7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuY29uc3QgZ2V0U3VibmV0SWRzID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHN1Ym5ldElkcyA9IHByb2Nlc3MuZW52Py5TVUJORVRfSURTIHx8ICcnO1xuICAgIHJldHVybiBKU09OLnBhcnNlKHN1Ym5ldElkcyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUpOyAvLyBOT1NPTkFSXG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuY29uc3QgZ2V0U2VjdXJpdHlHcm91cCA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZWN1cml0eUdyb3VwID0gcHJvY2Vzcy5lbnY/LlNFQ1VSSVRZX0dST1VQUyB8fCAnJztcbiAgICByZXR1cm4gSlNPTi5wYXJzZShzZWN1cml0eUdyb3VwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7IC8vIE5PU09OQVJcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG5uZXcgTWlncmF0aW9uU3RhY2soYXBwLCAnbWlncmF0aW9uJywge1xuICAvLyBOT1NPTkFSXG4gIGNvZGVQYXRoOiByZXNvbHZlKF9fZGlybmFtZSwgJy4uL21pZ3JhdGlvbicpLFxuICBoYW5kbGVyOiAnbGFtYmRhLmhhbmRsZXInLFxuICBydW50aW1lOiAnbm9kZWpzMTgueCcsXG4gIHZwY0NvbmZpZzoge1xuICAgIHNlY3VyaXR5R3JvdXBJZHM6IGdldFNlY3VyaXR5R3JvdXAoKSxcbiAgICBzdWJuZXRJZHM6IGdldFN1Ym5ldElkcygpLFxuICB9LFxuICBtZW1vcnlTaXplOiAyNTYsXG4gIGludm9jYXRpb25EYXRhOiAne30nLFxuICB0aW1lb3V0OiA2MCxcbiAgZW52VmFyczoge1xuICAgIERCX0hPU1Q6IHByb2Nlc3MuZW52LkRCX0hPU1QgfHwgJycsXG4gICAgREJfUE9SVDogcHJvY2Vzcy5lbnYuREJfUE9SVCB8fCAnJyxcbiAgICBEQl9VU0VSOiBwcm9jZXNzLmVudi5EQl9VU0VSIHx8ICcnLFxuICAgIERCX1BBU1NXT1JEOiBwcm9jZXNzLmVudi5EQl9QQVNTV09SRCB8fCAnJyxcbiAgICBEQl9EQVRBQkFTRTogcHJvY2Vzcy5lbnYuREJfREFUQUJBU0UgfHwgJycsXG4gIH0sXG4gIG5hbWVzcGFjZTogcHJvY2Vzcy5lbnYuTkFNRVNQQUNFIHx8ICcnLFxuICBlbnZpcm9ubWVudDogcHJvY2Vzcy5lbnYuRU5WIHx8ICcnLFxufSk7XG5cbm5ldyBMYW1iZGFTdGFjayhhcHAsICdsYW1iZGEnLCB7XG4gIC8vIE5PU09OQVJcbiAgczNCdWNrZXQ6IHByb2Nlc3MuZW52LlMzX0JVQ0tFVCEsXG4gIGNvZGVQYXRoOiBfX2Rpcm5hbWUsXG4gIGhhbmRsZXI6ICdsYW1iZGEuaGFuZGxlcicsXG4gIHJ1bnRpbWU6ICdub2RlanMxOC54JyxcbiAgbGF5ZXJQYXRoOiByZXNvbHZlKF9fZGlybmFtZSwgJy4uL2xheWVycycpLFxuICB2cGNDb25maWc6IHtcbiAgICBzZWN1cml0eUdyb3VwSWRzOiBnZXRTZWN1cml0eUdyb3VwKCksXG4gICAgc3VibmV0SWRzOiBnZXRTdWJuZXRJZHMoKSxcbiAgfSxcbiAgbWVtb3J5U2l6ZTogMjU2LFxuICB0aW1lb3V0OiAzMCxcbiAgY3VzdG9tRG9tYWluTmFtZToge1xuICAgIGRvbWFpbk5hbWU6IHByb2Nlc3MuZW52LkRPTUFJTl9OQU1FIHx8ICcnLFxuICAgIGhvc3RlZFpvbmVJZDogcHJvY2Vzcy5lbnYuSE9TVEVEX1pPTkVfSUQgfHwgJycsXG4gIH0sXG4gIG5hbWVzcGFjZTogcHJvY2Vzcy5lbnYuTkFNRVNQQUNFIHx8ICcnLFxuICBlbnZpcm9ubWVudDogcHJvY2Vzcy5lbnYuRU5WIHx8ICcnLFxuICBjcmVhdGVSb2xlOiB7XG4gICAgaWFtUG9saWN5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ0dyb3VwJyxcbiAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICAgICAgJ2VjMjpDcmVhdGVOZXR3b3JrSW50ZXJmYWNlJyxcbiAgICAgICAgICAgICdlYzI6RGVzY3JpYmVOZXR3b3JrSW50ZXJmYWNlcycsXG4gICAgICAgICAgICAnZWMyOkRlbGV0ZU5ldHdvcmtJbnRlcmZhY2UnLFxuICAgICAgICAgICAgJ2VjMjpBc3NpZ25Qcml2YXRlSXBBZGRyZXNzZXMnLFxuICAgICAgICAgICAgJ2VjMjpVbmFzc2lnblByaXZhdGVJcEFkZHJlc3NlcycsXG4gICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSksXG4gICAgaWFtUm9sZTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICBTZXJ2aWNlOiAnbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFNpZDogJycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pLFxuICB9LFxuICB1c2VJbWFnZTogdHJ1ZSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==

'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.AwsProvider = void 0;
const aws = require('@cdktf/provider-aws');
const constructs_1 = require('constructs');
class AwsProvider extends constructs_1.Construct {
  constructor(scope, name) {
    super(scope, name);
    // sonarignore:start
    new aws.provider.AwsProvider(this, 'aws', {
      // sonarignore:end
      region: process.env.AWS_REGION,
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_SECRET_ACCESS_KEY,
      profile: process.env.AWS_PROFILE,
      assumeRole: [
        {
          roleArn: process.env.AWS_ROLE_ARN,
        },
      ],
    });
  }
}
exports.AwsProvider = AwsProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzUHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhd3NQcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBMkM7QUFDM0MsMkNBQXFDO0FBRXJDLE1BQWEsV0FBWSxTQUFRLHNCQUFTO0lBQ3hDLFlBQVksS0FBZ0IsRUFBRSxJQUFZO1FBQ3hDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFbkIsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ3hDLFVBQVU7WUFDVixNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVO1lBQzlCLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQjtZQUN4QyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUI7WUFDNUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVztZQUNoQyxVQUFVLEVBQUU7Z0JBQ1Y7b0JBQ0UsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWTtpQkFDbEM7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQWpCRCxrQ0FpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhd3MgZnJvbSAnQGNka3RmL3Byb3ZpZGVyLWF3cyc7XG5pbXBvcnQge0NvbnN0cnVjdH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmV4cG9ydCBjbGFzcyBBd3NQcm92aWRlciBleHRlbmRzIENvbnN0cnVjdCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIG5hbWU6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBuYW1lKTtcblxuICAgIG5ldyBhd3MucHJvdmlkZXIuQXdzUHJvdmlkZXIodGhpcywgJ2F3cycsIHtcbiAgICAgIC8vIE5PU09OQVJcbiAgICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTixcbiAgICAgIGFjY2Vzc0tleTogcHJvY2Vzcy5lbnYuQVdTX0FDQ0VTU19LRVlfSUQsXG4gICAgICBzZWNyZXRLZXk6IHByb2Nlc3MuZW52LkFXU19TRUNSRVRfQUNDRVNTX0tFWSxcbiAgICAgIHByb2ZpbGU6IHByb2Nlc3MuZW52LkFXU19QUk9GSUxFLFxuICAgICAgYXNzdW1lUm9sZTogW1xuICAgICAgICB7XG4gICAgICAgICAgcm9sZUFybjogcHJvY2Vzcy5lbnYuQVdTX1JPTEVfQVJOLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuIl19

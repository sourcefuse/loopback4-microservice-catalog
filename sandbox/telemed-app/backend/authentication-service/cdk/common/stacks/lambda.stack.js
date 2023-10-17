'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.LambdaStack = void 0;
const random = require('@cdktf/provider-random');
const arc_cdk_1 = require('arc-cdk');
const cdktf_1 = require('cdktf');
const awsProvider_1 = require('../constructs/awsProvider');
const path = require('path');
class LambdaStack extends cdktf_1.TerraformStack {
  constructor(scope, id, config) {
    super(scope, id);
    new awsProvider_1.AwsProvider(this, 'aws'); // NOSONAR
    new random.provider.RandomProvider(this, 'random'); // NOSONAR
    // Create random value
    const pet = new random.pet.Pet(this, 'random-name', {
      length: 2,
    });
    // overwrite codePath based on useImage as deploy via docker needs different codePath
    config.codePath = path.resolve(
      config.codePath,
      `../${config.useImage ? '' : 'dist'}`,
    );
    // sonarignore:start
    new arc_cdk_1.LambdaWithApiGateway(this, 'lambda-apiGateway', {
    // sonarignore:end
      ...config,
      name: pet.id,
    });
  }
}
exports.LambdaStack = LambdaStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLnN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLnN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlEQUFpRDtBQUNqRCxxQ0FBb0U7QUFDcEUsaUNBQXFDO0FBRXJDLDJEQUFzRDtBQUN0RCw2QkFBOEI7QUFFOUIsTUFBYSxXQUFZLFNBQVEsc0JBQWM7SUFDN0MsWUFDRSxLQUFnQixFQUNoQixFQUFVLEVBQ1YsTUFBMkM7UUFFM0MsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLHlCQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVTtRQUN4QyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVU7UUFFOUQsc0JBQXNCO1FBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNsRCxNQUFNLEVBQUUsQ0FBQztTQUNWLENBQUMsQ0FBQztRQUVILHFGQUFxRjtRQUNyRixNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQzVCLE1BQU0sQ0FBQyxRQUFRLEVBQ2YsTUFBTSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUN0QyxDQUFDO1FBRUYsSUFBSSw4QkFBb0IsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDbEQsVUFBVTtZQUNWLEdBQUcsTUFBTTtZQUNULElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTtTQUNiLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTVCRCxrQ0E0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyByYW5kb20gZnJvbSAnQGNka3RmL3Byb3ZpZGVyLXJhbmRvbSc7XG5pbXBvcnQge0lMYW1iZGFXaXRoQXBpR2F0ZXdheSwgTGFtYmRhV2l0aEFwaUdhdGV3YXl9IGZyb20gJ2FyYy1jZGsnO1xuaW1wb3J0IHtUZXJyYWZvcm1TdGFja30gZnJvbSAnY2RrdGYnO1xuaW1wb3J0IHtDb25zdHJ1Y3R9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHtBd3NQcm92aWRlcn0gZnJvbSAnLi4vY29uc3RydWN0cy9hd3NQcm92aWRlcic7XG5pbXBvcnQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxuZXhwb3J0IGNsYXNzIExhbWJkYVN0YWNrIGV4dGVuZHMgVGVycmFmb3JtU3RhY2sge1xuICBjb25zdHJ1Y3RvcihcbiAgICBzY29wZTogQ29uc3RydWN0LFxuICAgIGlkOiBzdHJpbmcsXG4gICAgY29uZmlnOiBPbWl0PElMYW1iZGFXaXRoQXBpR2F0ZXdheSwgJ25hbWUnPixcbiAgKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIG5ldyBBd3NQcm92aWRlcih0aGlzLCAnYXdzJyk7IC8vIE5PU09OQVJcbiAgICBuZXcgcmFuZG9tLnByb3ZpZGVyLlJhbmRvbVByb3ZpZGVyKHRoaXMsICdyYW5kb20nKTsgLy8gTk9TT05BUlxuXG4gICAgLy8gQ3JlYXRlIHJhbmRvbSB2YWx1ZVxuICAgIGNvbnN0IHBldCA9IG5ldyByYW5kb20ucGV0LlBldCh0aGlzLCAncmFuZG9tLW5hbWUnLCB7XG4gICAgICBsZW5ndGg6IDIsXG4gICAgfSk7XG5cbiAgICAvLyBvdmVyd3JpdGUgY29kZVBhdGggYmFzZWQgb24gdXNlSW1hZ2UgYXMgZGVwbG95IHZpYSBkb2NrZXIgbmVlZHMgZGlmZmVyZW50IGNvZGVQYXRoXG4gICAgY29uZmlnLmNvZGVQYXRoID0gcGF0aC5yZXNvbHZlKFxuICAgICAgY29uZmlnLmNvZGVQYXRoLFxuICAgICAgYC4uLyR7Y29uZmlnLnVzZUltYWdlID8gJycgOiAnZGlzdCd9YCxcbiAgICApO1xuXG4gICAgbmV3IExhbWJkYVdpdGhBcGlHYXRld2F5KHRoaXMsICdsYW1iZGEtYXBpR2F0ZXdheScsIHtcbiAgICAgIC8vIE5PU09OQVJcbiAgICAgIC4uLmNvbmZpZyxcbiAgICAgIG5hbWU6IHBldC5pZCxcbiAgICB9KTtcbiAgfVxufVxuIl19

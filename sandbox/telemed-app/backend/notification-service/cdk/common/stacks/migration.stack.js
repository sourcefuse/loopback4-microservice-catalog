'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.MigrationStack = void 0;
const random = require('@cdktf/provider-random');
const cdktf_1 = require('cdktf');
const arc_cdk_1 = require('arc-cdk');
const awsProvider_1 = require('../constructs/awsProvider');
class MigrationStack extends cdktf_1.TerraformStack {
  constructor(scope, id, config) {
    super(scope, id);
    new awsProvider_1.AwsProvider(this, 'aws'); // NOSONAR
    new random.provider.RandomProvider(this, 'random'); // NOSONAR
    // Create random value
    const pet = new random.pet.Pet(this, 'random-name', {
      length: 2,
    });
    // sonarignore:start
    new arc_cdk_1.Lambda(this, 'lambda', {
    // sonarignore:end
      ...config,
      name: pet.id,
    });
  }
}
exports.MigrationStack = MigrationStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLnN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWlncmF0aW9uLnN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlEQUFpRDtBQUNqRCxpQ0FBcUM7QUFFckMscUNBQXdDO0FBQ3hDLDJEQUFzRDtBQUV0RCxNQUFhLGNBQWUsU0FBUSxzQkFBYztJQUNoRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLE1BQTZCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSx5QkFBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVU7UUFDeEMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVO1FBRTlELHNCQUFzQjtRQUN0QixNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDbEQsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFDLENBQUM7UUFFSCxJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUN6QixVQUFVO1lBQ1YsR0FBRyxNQUFNO1lBQ1QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1NBQ2IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBbEJELHdDQWtCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHJhbmRvbSBmcm9tICdAY2RrdGYvcHJvdmlkZXItcmFuZG9tJztcbmltcG9ydCB7VGVycmFmb3JtU3RhY2t9IGZyb20gJ2Nka3RmJztcbmltcG9ydCB7Q29uc3RydWN0fSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7SUxhbWJkYSwgTGFtYmRhfSBmcm9tICdhcmMtY2RrJztcbmltcG9ydCB7QXdzUHJvdmlkZXJ9IGZyb20gJy4uL2NvbnN0cnVjdHMvYXdzUHJvdmlkZXInO1xuXG5leHBvcnQgY2xhc3MgTWlncmF0aW9uU3RhY2sgZXh0ZW5kcyBUZXJyYWZvcm1TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGNvbmZpZzogT21pdDxJTGFtYmRhLCAnbmFtZSc+KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIG5ldyBBd3NQcm92aWRlcih0aGlzLCAnYXdzJyk7IC8vIE5PU09OQVJcbiAgICBuZXcgcmFuZG9tLnByb3ZpZGVyLlJhbmRvbVByb3ZpZGVyKHRoaXMsICdyYW5kb20nKTsgLy8gTk9TT05BUlxuXG4gICAgLy8gQ3JlYXRlIHJhbmRvbSB2YWx1ZVxuICAgIGNvbnN0IHBldCA9IG5ldyByYW5kb20ucGV0LlBldCh0aGlzLCAncmFuZG9tLW5hbWUnLCB7XG4gICAgICBsZW5ndGg6IDIsXG4gICAgfSk7XG5cbiAgICBuZXcgTGFtYmRhKHRoaXMsICdsYW1iZGEnLCB7XG4gICAgICAvLyBOT1NPTkFSXG4gICAgICAuLi5jb25maWcsXG4gICAgICBuYW1lOiBwZXQuaWQsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==

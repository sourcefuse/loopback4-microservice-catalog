// https://cdk.tf/testing
import { Testing } from 'cdktf';
import 'cdktf/lib/testing/adapters/jest'; // Load types for expect matchers
import { RedisStack } from '../common';

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



describe('My CDKTF Application', () => {
  let redisStack: RedisStack;
  let stack: string;

  beforeEach(() => {
    const app = Testing.app();
    redisStack = new RedisStack(app, 'test',{
        environment:'test',
        namespace:'test'
    });
    stack = Testing.synth(redisStack);
  });

  it('should match snapshot test', () => {
    expect(stack).toMatchSnapshot();
  });

  it('check if the produced terraform configuration is valid', () => {
    expect(Testing.fullSynth(redisStack)).toBeValidTerraform();
  });

});



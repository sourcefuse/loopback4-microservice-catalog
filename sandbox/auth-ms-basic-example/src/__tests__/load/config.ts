import type {LoadTestConfig} from '@sourceloop/load-testing';

const config: LoadTestConfig = {
  phases: [{name: 'smoke', duration: 30, arrivalRate: 5}],
};

export default config;

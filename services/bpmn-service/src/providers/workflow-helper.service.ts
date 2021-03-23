import {bind, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {Workflow} from '../models';
import {WorflowManager} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class WorkflowProvider
  implements Provider<WorflowManager> {
  constructor() { }

  value() {
    return {
      getWorkflowById: async () => {
        return Promise.resolve(new Workflow());
      },
      startWorkflow: async () => {
        return Promise.resolve(true);
      },
      createWorkflow: async () => {
        return Promise.resolve(new Workflow());
      },
      updateWorkflow: async () => {
        return Promise.resolve(new Workflow());
      },
    };
  }
}

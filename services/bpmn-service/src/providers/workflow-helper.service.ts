import {bind, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {WorflowManager} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class WorkflowProvider implements Provider<WorflowManager> {
  value() {
    return {
      getWorkflowById: async () => {
        throw new HttpErrors.BadRequest(
          'getWorkflowId function not implemented',
        );
      },
      startWorkflow: async () => {
        throw new HttpErrors.BadRequest(
          'startWorkflow function not implemented',
        );
      },
      createWorkflow: async () => {
        throw new HttpErrors.BadRequest(
          'createWorkflow function not implemented',
        );
      },
      updateWorkflow: async () => {
        throw new HttpErrors.BadRequest(
          'updateWorkflow function not implemented',
        );
      },
      deleteWorkflowById: async () => {
        throw new HttpErrors.BadRequest(
          'deleteWorkflowById function not implemented',
        );
      },
      deleteWorkflowVersionById: async () => {
        throw new HttpErrors.BadRequest(
          'deleteWorkflowVersionById function not implemented',
        );
      },
    };
  }
}

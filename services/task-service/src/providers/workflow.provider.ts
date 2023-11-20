// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {bind, BindingScope, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {WorkflowManagerExtended} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class WorkflowProvider implements Provider<WorkflowManagerExtended> {
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
      getWorkflowTasksById: async () => {
        throw new HttpErrors.BadRequest(
          'getWorkflowTasksById function not implemented',
        );
      },
      completeWorkflowTask: async () => {
        throw new HttpErrors.BadRequest(
          'completeWorkflowTask function not implemented',
        );
      },
    };
  }
}

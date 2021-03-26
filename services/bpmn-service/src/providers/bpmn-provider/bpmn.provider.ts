import {Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';

import {ErrorKeys} from '../../constants/error-keys';
import {BPMN, ExecutionRequest} from '../types';
import {Workflow, WorkflowDto} from '../../models';

export class BpmnProvider implements Provider<BPMN> {

  value() {
    return {
      create: async (workflow: WorkflowDto) => {
        throw new HttpErrors.UnprocessableEntity(
          ErrorKeys.ProviderNotFound,
        );
      },
      update: async (workflow: WorkflowDto) => { //NOSONAR
        throw new HttpErrors.UnprocessableEntity(
          ErrorKeys.ProviderNotFound,
        );
      },
      delete: async (workflow: Workflow) => { //NOSONAR
        throw new HttpErrors.UnprocessableEntity(
          ErrorKeys.ProviderNotFound,
        );
      },
      execute: async (executionRequest: ExecutionRequest) => { //NOSONAR
        throw new HttpErrors.UnprocessableEntity(
          ErrorKeys.ProviderNotFound,
        );
      },
    };
  }
}

// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {bind, inject, BindingScope, Provider, Getter} from '@loopback/core';
import {Workflow} from '../../models';
import {WorflowManager} from '../../types';
import {MockEngine} from '../mock-engine';
import {MockCamundaWorkflow, MOCK_BPMN_ENGINE_KEY} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class WorkflowMockProvider implements Provider<WorflowManager> {
  workflowList: {
    [id: string]: {
      [version: string]: MockCamundaWorkflow;
    };
  } = {};
  constructor(
    @inject.getter(MOCK_BPMN_ENGINE_KEY)
    private readonly engine: Getter<MockEngine>,
  ) {}
  value(): WorflowManager {
    return {
      getWorkflowById: async (workflow: Workflow) => {
        const engine = await this.engine();
        return new Workflow(engine.get(workflow.name));
      },
      startWorkflow: async (input, workflow, version) => {
        const engine = await this.engine();
        return new Workflow(
          await engine.start(
            input,
            workflow.name,
            version?.version ?? workflow.workflowVersion,
          ),
        );
      },
      createWorkflow: async workflow => {
        const engine = await this.engine();
        const mockWorkflow = engine.create(workflow);
        return {
          version: mockWorkflow.workflowVersion,
          provider: 'bpmn',
          processId: workflow.name,
          externalId: workflow.name,
        };
      },
      updateWorkflow: async workflow => {
        const engine = await this.engine();
        const mockWorkflow = engine.update(workflow);
        return {
          version: mockWorkflow.workflowVersion,
          provider: 'bpmn',
          processId: workflow.name,
          externalId: workflow.name,
        };
      },
      deleteWorkflowById: async workflow => {
        const engine = await this.engine();
        const mockWorkflow = engine.delete(workflow.name);
        return new Workflow(mockWorkflow);
      },
      deleteWorkflowVersionById: async version => {
        const engine = await this.engine();
        engine.deleteVersion(version.externalWorkflowId, version.version);
        return version;
      },
    };
  }
}

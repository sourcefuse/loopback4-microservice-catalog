// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {bind, BindingScope, Provider, service} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  WorflowManager,
  Workflow,
  WorkflowVersion,
  WorkflowDto,
} from '@sourceloop/bpmn-service';
import {CamundaService} from '../services/camunda.service';

@bind({scope: BindingScope.TRANSIENT})
export class BpmnProvider implements Provider<WorflowManager> {
  constructor(
    @service(CamundaService)
    private readonly camunda: CamundaService,
  ) {}
  value(): WorflowManager {
    return {
      getWorkflowById: async workflow => {
        const response = await this.camunda.get<AnyObject>(
          workflow.externalIdentifier,
        );

        return new Workflow({
          provider: 'camunda',
          id: workflow.id,
          workflowVersion: workflow.workflowVersion,
          externalIdentifier: response.id,
          name: response.name,
          inputSchema: workflow.inputSchema,
        });
      },
      startWorkflow: async (input, workflow, version) => {
        let response;
        if (version) {
          response = await this.camunda.execute<AnyObject>(
            version.externalWorkflowId,
            input,
          );
        } else {
          response = await this.camunda.execute<AnyObject>(
            workflow.externalIdentifier,
            input,
          );
        }
        return response;
      },
      createWorkflow: async (workflowDto: WorkflowDto) => {
        const response = await this.camunda.create<AnyObject>(
          workflowDto.name,
          Buffer.from(workflowDto.bpmnFile, 'utf-8'),
        );
        let version = 1;
        let id;
        if (response.deployedProcessDefinitions) {
          const processDefinition = Object.values(
            //NOSONAR
            response.deployedProcessDefinitions, //NOSONAR
          )[0] as AnyObject; //NOSONAR
          version = processDefinition.version;
          id = processDefinition.id;
        } else {
          throw new HttpErrors.BadRequest(
            'Workflow with same name and definition already exists',
          );
        }
        return {
          version: version,
          provider: 'camunda',
          processId: id,
          externalId: id,
          fileRef: workflowDto.bpmnFile,
        };
      },
      updateWorkflow: async (workflowDto: WorkflowDto) => {
        const response = await this.camunda.create<AnyObject>(
          workflowDto.name,
          Buffer.from(workflowDto.bpmnFile, 'utf-8'),
        );
        let version;
        let id;
        if (response.deployedProcessDefinitions) {
          const processDefinition = Object.values(
            //NOSONAR
            response.deployedProcessDefinitions, //NOSONAR
          )[0] as AnyObject; //NOSONAR
          version = processDefinition.version;
          id = processDefinition.id;
        } else {
          throw new Error('Workflow not changed or Worflow does not exist!');
        }
        return {
          version: version,
          provider: 'camunda',
          processId: id,
          externalId: id,
          fileRef: workflowDto.bpmnFile,
        };
      },
      deleteWorkflowById: async (workflow: Workflow) => {
        await this.camunda.delete(
          workflow.workflowVersions.map(
            (version: WorkflowVersion) => version.externalWorkflowId as string,
          ),
        );
        return workflow;
      },

      deleteWorkflowVersionById: async (version: WorkflowVersion) => {
        await this.camunda.deleteVersion(version.externalWorkflowId);
        return version;
      },
    };
  }
}

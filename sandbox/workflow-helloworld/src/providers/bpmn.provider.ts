import {
  bind,
  BindingScope,
  Provider,
  service
} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {WorflowManager, Workflow, WorkflowDto} from '@sourceloop/bpmn-service';
import {CamundaService} from '../services/camunda.service';

@bind({scope: BindingScope.TRANSIENT})
export class BpmnProvider implements Provider<WorflowManager> {
  constructor(
    @service(CamundaService)
    private readonly camunda: CamundaService,
  ) { }
  value(): WorflowManager {
    return {
      getWorkflowById: async workflow => {
        const response = await this.camunda.get(workflow.externalIdentifier);

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
          response = await this.camunda.execute(
            version.externalWorkflowId,
            input,
          );
        } else {
          response = await this.camunda.execute(
            workflow.externalIdentifier,
            input,
          );
        }
        return response;
      },
      createWorkflow: async (workflowDto: WorkflowDto) => {
        const response = await this.camunda.create(
          workflowDto.name,
          Buffer.from(workflowDto.bpmnFile, 'utf-8'),
        );
        let version = 1;
        let id = response.id;
        if (response.deployedProcessDefinitions) {
          const processDefinition = Object.values(//NOSONAR
            response.deployedProcessDefinitions,//NOSONAR
          )[0] as AnyObject; //NOSONAR
          version = processDefinition.version;
          id = processDefinition.id;
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
        const response = await this.camunda.create(
          workflowDto.name,
          Buffer.from(workflowDto.bpmnFile, 'utf-8'),
        );
        let version;
        let id;
        if (response.deployedProcessDefinitions) {
          const processDefinition = Object.values(//NOSONAR
            response.deployedProcessDefinitions,//NOSONAR
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
      deleteWorkflowById: async workflow => {
        await this.camunda.delete(workflow.externalIdentifier);
        return workflow;
      },
    };
  }
}

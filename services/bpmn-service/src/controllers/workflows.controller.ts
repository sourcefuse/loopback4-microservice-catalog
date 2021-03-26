import {inject} from '@loopback/core';
import {AnyObject, Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, HttpErrors, param, patch, post, requestBody} from '@loopback/rest';
import {ExecutionRequestDto, Workflow, WorkflowDto, WorkflowVersion} from '../models';
import {WorkflowRepository, WorkflowVersionRepository} from '../repositories';
import {BPMN, BPMNBindings, ExecutionRequest} from '../providers';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {ErrorKeys, OPERATION_SECURITY_SPEC} from '../constants';
import {PermissionKeys} from '../enum';
import Ajv from 'ajv';

const baseUrl = '/workflows';

export class WorkflowsController {
  constructor(
    @inject(BPMNBindings.BPMNProvider)
    private readonly bpmnProvider: BPMN,
    @repository(WorkflowRepository)
    public workflowRepository: WorkflowRepository,
    @repository(WorkflowVersionRepository)
    public workflowVersionRepository: WorkflowVersionRepository,
  ) {
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.CreateWorkflow]})
  @post(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Workflow model instance',
        content: {'application/json': {schema: getModelSchemaRef(Workflow)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkflowDto, {
            title: 'NewWorkflow',
          }),
        },
      },
    })
      workflow: Omit<WorkflowDto, 'id'>,
  ): Promise<Workflow> {
    if (!(workflow.name.includes('.bpmn') || workflow.name.includes('.yaml'))) {
      workflow.name = `${workflow.name}.bpmn`;
    }
    try {
      // first deploy the workflow in the BPMN provider
      const response = await this.bpmnProvider.create(workflow);
      // create a Workflow model instance from response
      const entity = new Workflow({
        workflowVersion: response.version,
        externalIdentifier: response.processId,
        provider: response.provider,
        params: workflow.params,
      });
      // save the details
      const newWorkflow = await this.workflowRepository.create(entity);
      // create new workflow version instance
      const version = new WorkflowVersion({
        workflowId: newWorkflow.id,
        version: response.version,
        bpmnDiagram: workflow.bpmnFile,
        externalWorkflowId: response.externalId,
        bpmnFileName: workflow.name,
        params: workflow.params,
      });
      // save the version
      await this.workflowVersionRepository.create(version);
      return newWorkflow;
    } catch (e) {
      throw new HttpErrors.BadRequest(e);
    }
  }


  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.UpdateWorkflow]})
  @patch(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Workflow PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkflowDto, {partial: true}),
        },
      },
    })
      workflow: WorkflowDto,
  ): Promise<void> {
    // first deploy the workflow in the BPMN provider
    try {
      const response = await this.bpmnProvider.update(workflow);
      // create a Workflow model instance from response
      const entity = new Workflow({
        workflowVersion: response.version,
        externalIdentifier: response.processId,
        provider: response.provider,
        params: workflow.params,
      });
      // update the details for existing workflow id
      await this.workflowRepository.updateById(id, entity);
      // create new workflow version instance
      const version = new WorkflowVersion({
        workflowId: id,
        version: response.version,
        bpmnDiagram: workflow.bpmnFile,
        externalWorkflowId: response.externalId,
        bpmnFileName: workflow.name,
        params: workflow.params,
      });
      // save the version
      await this.workflowVersionRepository.create(version);
    } catch (e) {
      throw new HttpErrors.BadRequest(e);
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.ExecuteWorkflow]})
  @post('/workflows/execute/{processId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Workflow instance',
      },
    },
  })
  async execute(
    @param.path.string('processId') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ExecutionRequestDto),
        },
      },
    })
      instance: ExecutionRequestDto,
  ): Promise<AnyObject> {
    const workflow = await this.workflowRepository.findOne({
      where: {
        externalIdentifier: id,
      },
    });
    if (!workflow) {
      throw new HttpErrors.NotFound(ErrorKeys.WorkflowNotFOund);
    }
    let params = workflow.params;
    if (instance.workflowVersion) {
      const version = await this.workflowVersionRepository.findOne({
        where: {
          version: instance.workflowVersion,
          workflowId: workflow.id,
        },
      });
      if (version) {
        params = version.params;
      }
    }
    const ajv = new Ajv();
    const validate = ajv.compile(params);
    const isValidated = validate(instance.input);
    try {
      if (!isValidated) {
        throw validate.errors; //NOSONAR
      }
      const request: ExecutionRequest = {
        processId: workflow.externalIdentifier,
        input: instance.input,
        version: instance.workflowVersion,
      };
      return await this.bpmnProvider.execute(request);
    } catch (e) {
      throw new HttpErrors.UnprocessableEntity(e);
    }
  }


  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.DeleteWorkflow]})
  @del(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Workflow DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.workflowRepository.deleteById(id);
  }


  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.ViewWorkflow]})
  @get(`${baseUrl}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Workflow model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Workflow) where?: Where<Workflow>,
  ): Promise<Count> {
    return this.workflowRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.ViewWorkflow]})
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Workflow model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Workflow, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Workflow) filter?: Filter<Workflow>,
  ): Promise<Workflow[]> {
    return this.workflowRepository.find(filter);
  }


  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKeys.ViewWorkflow]})
  @get(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Workflow model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Workflow, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Workflow, {exclude: 'where'}) filter?: FilterExcludingWhere<Workflow>,
  ): Promise<Workflow> {
    return this.workflowRepository.findById(id, filter);
  }
}

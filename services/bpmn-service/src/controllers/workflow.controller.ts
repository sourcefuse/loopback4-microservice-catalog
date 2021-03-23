import {inject} from '@loopback/core';
import {
  CountSchema,
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getFilterSchemaFor,
  getModelSchemaRef,





  HttpErrors, param,
  patch,
  post,

  Request, requestBody
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {ErrorKeys} from '../enums/error-keys.enum';
import {PermissionKey} from '../enums/permission-key.enum';
import {WorkflowServiceBindings} from '../keys';
import {Workflow} from '../models';
import {
  WorkflowRepository
} from '../repositories';
import {WorflowManager} from '../types';
const basePath = '/workflow';

export class WorkflowController {
  constructor(
    @repository(WorkflowRepository)
    public workflowRepository: WorkflowRepository,
    @inject(WorkflowServiceBindings.WorkflowManager)
    private readonly workflowManagerService: WorflowManager,
  ) { }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateWorkflow]})
  @post(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Workflow model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Workflow)},
        },
      },
    },
  })
  async create(
    @requestBody({
      description: 'multipart/form-data',
      required: true,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {
            type: 'object'
          },
        },
      },
    })
    request: Request,
  ): Promise<Workflow> {
    const workFlowInfo = await this.workflowManagerService.createWorkflow(request);
    if (!workFlowInfo) {
      throw new HttpErrors.BadRequest(ErrorKeys.ErrorCreatingWorkflow);
    }

    if (!workFlowInfo.name) {
      workFlowInfo.name = request.body.name;
    }

    if (!workFlowInfo.description) {
      workFlowInfo.description = request.body.description;
    }
    return this.workflowRepository.create(workFlowInfo);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateWorkflow]})
  @patch(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Workflow model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Workflow)},
        },
      },
    },
  })
  async updateById(
    @requestBody({
      description: 'multipart/form-data',
      required: true,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {
            type: 'object'
          },
        },
      },
    })
    request: Request,
    @param.path.string('id') id: string,
  ): Promise<Workflow> {
    const workFlowInfo = await this.workflowManagerService.createWorkflow(request);
    if (!workFlowInfo) {
      throw new HttpErrors.BadRequest(ErrorKeys.ErrorCreatingWorkflow);
    }

    if (!workFlowInfo.name) {
      workFlowInfo.name = request.body.name;
    }

    if (!workFlowInfo.description) {
      workFlowInfo.description = request.body.description;
    }
    return this.workflowRepository.create(workFlowInfo);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateWorkflow]})
  @post(`${basePath}/{id}/start`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Initiate the workflow',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Workflow)},
        },
      },
    },
  })
  async startWorkflow(
    @param.path.string('id') id: string,
  ): Promise<boolean> {
    const workFlowInfo = await this.workflowRepository.findById(id);
    return this.workflowManagerService.startWorkflow(workFlowInfo);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewWorkflow]})
  @get(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Notification model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.path.string('id') id: string,
  ): Promise<Workflow> {
    const workflow = await this.workflowRepository.findById(id);
    return this.workflowManagerService.getWorkflowById(workflow);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewWorkflow]})
  @get(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Workflow model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(Workflow)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Workflow))
    filter?: Filter<Workflow>,
  ): Promise<Workflow[]> {
    return this.workflowRepository.find(filter);
  }
}

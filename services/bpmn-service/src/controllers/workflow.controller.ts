// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {AnyObject, Filter} from '@loopback/repository';
import {
  del,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums/permission-key.enum';
import {WorkflowServiceBindings} from '../keys';
import {Workflow} from '../models';
import {ExecuteWorkflowDto} from '../models/execute-workflow-dto';
import {WorkflowDto} from '../models/workflow-dto.model';
import {IWorkflowService} from '../types';
const basePath = '/workflows';

export class WorkflowController {
  constructor(
    @inject(WorkflowServiceBindings.WorkflowService)
    private readonly workflowService: IWorkflowService,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateWorkflow,
      PermissionKey.CreateWorkflowNum,
    ],
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
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
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(WorkflowDto, {
            title: 'NewWorkflow',
          }),
        },
      },
    })
    workflowDto: WorkflowDto,
  ): Promise<Workflow> {
    return this.workflowService.create(workflowDto);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateWorkflow,
      PermissionKey.UpdateWorkflowNum,
    ],
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Workflow PATCH success',
      },
    },
  })
  async updateById(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(WorkflowDto, {partial: true}),
        },
      },
    })
    workflowDto: WorkflowDto,
    @param.path.string('id') id: string,
  ): Promise<void> {
    return this.workflowService.updateById(id, workflowDto);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ExecuteWorkflow,
      PermissionKey.ExecuteWorkflowNum,
    ],
  })
  @post(`${basePath}/{id}/execute`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Workflow instance',
      },
    },
  })
  async startWorkflow(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(ExecuteWorkflowDto),
        },
      },
    })
    instance: ExecuteWorkflowDto,
  ): Promise<AnyObject> {
    return this.workflowService.executeById(id, instance);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewWorkflow, PermissionKey.ViewWorkflowNum],
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
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
    return this.workflowService.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewWorkflow, PermissionKey.ViewWorkflowNum],
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Workflow Model',
      },
    },
  })
  async count(@param.path.string('id') id: string): Promise<Workflow> {
    return this.workflowService.findById(id);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.DeleteWorkflow,
      PermissionKey.DeleteWorkflowNum,
    ],
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Workflow DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    return this.workflowService.deleteById(id);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.DeleteWorkflow,
      PermissionKey.DeleteWorkflowNum,
    ],
  })
  @del(`${basePath}/{id}/version/{version}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Workflow DELETE success',
      },
    },
  })
  async deleteVersionById(
    @param.path.string('id') id: string,
    @param.path.number('version') versionNumber: number,
  ): Promise<void> {
    return this.workflowService.deleteVersionById(id, versionNumber);
  }
}

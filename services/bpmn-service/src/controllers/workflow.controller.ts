﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {AnyObject, Filter, repository} from '@loopback/repository';
import {
  HttpErrors,
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
import {ErrorKeys} from '../enums/error-keys.enum';
import {PermissionKey} from '../enums/permission-key.enum';
import {WorkflowServiceBindings} from '../keys';
import {Workflow, WorkflowVersion} from '../models';
import {ExecuteWorkflowDto} from '../models/execute-workflow-dto';
import {WorkflowDto} from '../models/workflow-dto.model';
import {WorkflowRepository} from '../repositories';
import {WorkflowVersionRepository} from '../repositories/workflow-version.repository';
import {
  ExecutionInputValidator,
  WorflowManager,
  WorkerImplementationFn,
  WorkerMap,
} from '../types';
const basePath = '/workflows';

export class WorkflowController {
  constructor(
    @repository(WorkflowRepository)
    public workflowRepository: WorkflowRepository,
    @repository(WorkflowVersionRepository)
    public workflowVersionRepository: WorkflowVersionRepository,
    @inject(WorkflowServiceBindings.WorkflowManager)
    private readonly workflowManagerService: WorflowManager,
    @inject(WorkflowServiceBindings.ExecutionInputValidatorFn)
    private readonly execInputValidator: ExecutionInputValidator,
    @inject.getter(WorkflowServiceBindings.WORKER_MAP)
    private readonly workerMapGetter: Getter<WorkerMap>,
    @inject(WorkflowServiceBindings.WorkerImplementationFunction)
    private readonly workerFn: WorkerImplementationFn,
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
    try {
      const workflowResponse = await this.workflowManagerService.createWorkflow(
        workflowDto,
      );

      const entity = new Workflow({
        workflowVersion: workflowResponse.version,
        externalIdentifier: workflowResponse.processId,
        name: workflowDto.name,
        provider: workflowResponse.provider,
        inputSchema: workflowDto.inputSchema,
        description: workflowDto.description,
      });

      const newWorkflow = await this.workflowRepository.create(entity);

      const version = new WorkflowVersion({
        workflowId: newWorkflow.id,
        version: workflowResponse.version,
        bpmnDiagram: workflowResponse.fileRef,
        externalWorkflowId: workflowResponse.externalId,
        inputSchema: workflowDto.inputSchema,
      });

      await this.workflowVersionRepository.create(version);
      return newWorkflow;
    } catch (e) {
      throw new HttpErrors.BadRequest(e);
    }
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
    const workflowResponse = await this.workflowManagerService.updateWorkflow(
      workflowDto,
    );

    const entity = new Workflow({
      workflowVersion: workflowResponse.version,
      externalIdentifier: workflowResponse.processId,
      name: workflowDto.name,
      provider: workflowResponse.provider,
      inputSchema: workflowDto.inputSchema,
      description: workflowDto.description,
    });

    await this.workflowRepository.updateById(id, entity);

    const version = new WorkflowVersion({
      workflowId: id,
      version: workflowResponse.version,
      bpmnDiagram: workflowResponse.fileRef,
      externalWorkflowId: workflowResponse.externalId,
      inputSchema: workflowDto.inputSchema,
    });

    await this.workflowVersionRepository.create(version);
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
    const workflow = await this.workflowRepository.findOne({
      where: {
        id: id,
      },
    });
    let version;
    if (!workflow) {
      throw new HttpErrors.NotFound(ErrorKeys.WorkflowNotFound);
    }
    let inputSchema = workflow.inputSchema;
    if (instance.workflowVersion) {
      version = await this.workflowVersionRepository.findOne({
        where: {
          version: instance.workflowVersion,
          workflowId: workflow.id,
        },
      });
      if (version) {
        inputSchema = version.inputSchema;
      } else {
        throw new HttpErrors.NotFound(ErrorKeys.VersionNotFound);
      }
    }

    await this.execInputValidator(inputSchema, instance.input);
    await this.initWorkers(workflow.name);
    return this.workflowManagerService.startWorkflow(
      instance.input,
      workflow,
      version,
    );
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
    return this.workflowRepository.find(filter, {
      include: ['workflowVersions'],
    });
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
    const workflow = await this.workflowRepository.findById(id);
    return this.workflowManagerService.getWorkflowById(workflow);
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
    const workflow = await this.workflowRepository.findById(id, {
      include: ['workflowVersions'],
    });
    await this.workflowManagerService.deleteWorkflowById(workflow);
    await this.workflowVersionRepository.deleteAll({
      workflowId: workflow.id,
    });
    await this.workflowRepository.deleteById(workflow.id);
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
    const workflow = await this.workflowRepository.findById(id);
    if (workflow.workflowVersion === versionNumber) {
      throw new HttpErrors.BadRequest(
        'Can not delete latest version of a workflow',
      );
    }
    const version = await this.workflowVersionRepository.findOne({
      where: {
        workflowId: id,
        version: versionNumber,
      },
    });
    if (!this.workflowManagerService.deleteWorkflowVersionById) {
      throw new HttpErrors.InternalServerError(
        'Version Delete Provider Missing',
      );
    }

    if (version) {
      await this.workflowManagerService.deleteWorkflowVersionById(version);
      await this.workflowVersionRepository.deleteById(version.id);
    } else {
      throw new HttpErrors.NotFound(ErrorKeys.VersionNotFound);
    }
  }

  private async initWorkers(workflowName: string) {
    const workerMap = await this.workerMapGetter();
    if (workerMap?.[workflowName]) {
      const workerList = workerMap[workflowName];
      for (const worker of workerList) {
        if (!worker.running) {
          await this.workerFn(worker);
          worker.running = true;
        }
      }
    }
  }
}

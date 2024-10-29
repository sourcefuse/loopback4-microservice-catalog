import {Getter, inject} from '@loopback/core';
import {
  AnyObject,
  Filter,
  FilterExcludingWhere,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ErrorKeys} from '../enums';
import {WorkflowServiceBindings} from '../keys';
import {
  ExecuteWorkflowDto,
  Workflow,
  WorkflowDto,
  WorkflowVersion,
} from '../models';
import {WorkflowRepository, WorkflowVersionRepository} from '../repositories';
import {
  ExecutionInputValidator,
  IWorkflowService,
  WorflowManager,
  WorkerImplementationFn,
  WorkerMap,
} from '../types';

export class WorkflowService implements IWorkflowService {
  constructor(
    @repository(WorkflowRepository)
    private readonly workflowRepository: WorkflowRepository,
    @repository(WorkflowVersionRepository)
    private readonly workflowVersionRepository: WorkflowVersionRepository,
    @inject(WorkflowServiceBindings.WorkflowManager)
    private readonly workflowManagerService: WorflowManager,
    @inject.getter(WorkflowServiceBindings.WORKER_MAP)
    private readonly workerMapGetter: Getter<WorkerMap>,
    @inject(WorkflowServiceBindings.WorkerImplementationFunction)
    private readonly workerFn: WorkerImplementationFn,
    @inject(WorkflowServiceBindings.ExecutionInputValidatorFn)
    private readonly execInputValidator: ExecutionInputValidator,
  ) {}
  async create(workflowDto: WorkflowDto): Promise<Workflow> {
    const workflowResponse =
      await this.workflowManagerService.createWorkflow(workflowDto);

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
  }

  async updateById(id: string, workflow: Partial<WorkflowDto>): Promise<void> {
    const exists = await this.workflowRepository.exists(id);

    if (!exists) {
      throw new HttpErrors.NotFound(ErrorKeys.WorkflowNotFound);
    }

    const workflowResponse =
      await this.workflowManagerService.updateWorkflow(workflow);

    const entity = new Workflow({
      workflowVersion: workflowResponse.version,
      externalIdentifier: workflowResponse.processId,
      name: workflow.name,
      provider: workflowResponse.provider,
      inputSchema: workflow.inputSchema,
      description: workflow.description,
    });

    await this.workflowRepository.updateById(id, entity);

    const version = new WorkflowVersion({
      workflowId: id,
      version: workflowResponse.version,
      bpmnDiagram: workflowResponse.fileRef,
      externalWorkflowId: workflowResponse.externalId,
      inputSchema: workflow.inputSchema,
    });

    await this.workflowVersionRepository.create(version);
  }

  async deleteById(id: string): Promise<void> {
    const workflow = await this.workflowRepository.findById(id, {
      include: ['workflowVersions'],
    });
    await this.workflowVersionRepository.deleteAll({
      workflowId: workflow.id,
    });
    await this.workflowRepository.deleteById(workflow.id);
  }

  async deleteVersionById(id: string, versionNumber: number): Promise<void> {
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

  find(filter?: Filter<Workflow> | undefined): Promise<Workflow[]> {
    return this.workflowRepository.find(filter);
  }

  findById(
    id: string,
    filter?: FilterExcludingWhere<Workflow> | undefined,
  ): Promise<Workflow> {
    return this.workflowRepository.findById(id, filter);
  }

  async count(id: string): Promise<Workflow> {
    const workflow = await this.workflowRepository.findById(id);
    return this.workflowManagerService.getWorkflowById(workflow);
  }

  async executeById(
    id: string,
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
    await this._initWorkers(workflow.name);
    return this.workflowManagerService.startWorkflow(
      instance.input,
      workflow,
      version,
    );
  }

  private async _initWorkers(workflowName: string) {
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

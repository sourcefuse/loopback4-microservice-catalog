import {
  injectable,
  BindingScope,
  service,
  Getter,
  inject,
} from '@loopback/core';
import {AnyObject, Filter, repository} from '@loopback/repository';
import {EventRepository} from '../repositories/event.repository';
import {
  Events,
  EventWorkflowMapping,
  Tasks,
  TaskWorkFlowMapping,
} from '../models';
import {HttpErrors} from '@loopback/rest';
import {CamundaService} from './camunda.service';
import {
  WorkflowServiceBindings,
  WorkerRegisterFn,
  WorkerMap,
  WorkerImplementationFn,
  BPMTask,
  WorkflowRepository,
  Workflow,
} from '@sourceloop/bpmn-service';
import {InvokeWorkflowCommand, SendNotificationCommand} from '../commands';
import {TaskOperationService} from './task-operation.service';
import {
  EventWorkflowMappingRepository,
  TaskWorkFlowMappingRepository,
} from '../repositories';

@injectable({
  scope: BindingScope.SINGLETON,
})
export class EventProcessorService {
  constructor(
    @repository(EventRepository)
    private readonly eventRepo: EventRepository,
    @repository(WorkflowRepository)
    private readonly workflowRepo: WorkflowRepository,
    @repository(EventWorkflowMappingRepository)
    private readonly eventWorkflowMappingRepo: EventWorkflowMappingRepository,
    @repository(TaskWorkFlowMappingRepository)
    private readonly taskWorkflowMappingRepo: TaskWorkFlowMappingRepository,
    @service(CamundaService)
    private readonly camundaService: CamundaService,
    @service(TaskOperationService)
    private readonly taskOpsService: TaskOperationService,
    @inject(WorkflowServiceBindings.RegisterWorkerFunction)
    private readonly regFn: WorkerRegisterFn,
    @inject.getter(WorkflowServiceBindings.WORKER_MAP)
    private readonly workerMapGetter: Getter<WorkerMap>,
    @inject(WorkflowServiceBindings.WorkerImplementationFunction)
    private readonly workerFn: WorkerImplementationFn,
  ) {
    // empty constuctor
  }
  public async processEvent(event: Events): Promise<void> {
    console.log('PROCESSING EVENT - ', event.key);

    // adding event to database
    await this.eventRepo.create(event);

    //get workflow key from event key
    const eventWorkflowMapping = await this.findEventWorkflowByKey(event.key);

    if (eventWorkflowMapping) {
      // fetch workflow by key and return it
      const workflow = await this.findWorkflowByKey(
        eventWorkflowMapping.workflowKey,
      );

      if (workflow) {
        // register workers from topic names
        const payloadTasks = event.payload.tasks;
        for (const task of payloadTasks) {
          await this.registerWorkers(workflow, task);
        }

        // init the workers
        await this.initWorkers(workflow.name);

        // execute the workflow
        await this.camundaService.execute(workflow.externalIdentifier, {});
      } else {
        throw HttpErrors[404];
      }
    }
  }

  private async findWorkflowByKey(keyValue: string): Promise<Workflow | null> {
    const filter: Filter<Workflow> = {
      where: {
        name: keyValue,
      },
    };

    return this.workflowRepo.findOne(filter);
  }

  private async findEventWorkflowByKey(
    keyValue: string,
  ): Promise<EventWorkflowMapping | null> {
    const filter: Filter<EventWorkflowMapping> = {
      where: {
        eventKey: keyValue,
      },
    };

    return this.eventWorkflowMappingRepo.findOne(filter);
  }

  private async findTaskWorkflowByKey(
    keyValue: string,
  ): Promise<TaskWorkFlowMapping | null> {
    const filter: Filter<TaskWorkFlowMapping> = {
      where: {
        taskKey: keyValue,
      },
    };

    return this.taskWorkflowMappingRepo.findOne(filter);
  }

  private async registerWorkers(workflow: Workflow, task: AnyObject) {
    await this.taskOpsService.addTaskToDB(task);
    let cmd;
    if (task.type == 'notification') {
      cmd = new SendNotificationCommand(task.topic);
    } else if (task.type == 'workflow') {
      const workflowKey = await this.findTaskWorkflowByKey(task.topic);
      if (workflowKey) {
        const wf = await this.findWorkflowByKey(workflowKey.workflowKey);
        if (wf) {
          cmd = new InvokeWorkflowCommand(
            wf.externalIdentifier,
            task.topic,
            this.camundaService,
          );
        }
      }
    }
    if (!cmd) {
      // throw an invalid error
      return;
    }

    await this.regFn(workflow.name, cmd.topic, new BPMTask(cmd));
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

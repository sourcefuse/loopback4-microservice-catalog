import {
  injectable,
  BindingScope,
  service,
  Getter,
  inject,
} from '@loopback/core';
import {AnyObject, Filter, repository} from '@loopback/repository';
import {EventRepository} from '../repositories/event.repository';
import {EventModel} from '../models';
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

@injectable({
  scope: BindingScope.SINGLETON,
})
export class EventProcessorService {
  constructor(
    @repository(EventRepository)
    private readonly eventRepo: EventRepository,
    @repository(WorkflowRepository)
    private readonly workflowRepo: WorkflowRepository,
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
  public async processEvent(event: EventModel): Promise<void> {
    console.log('PROCESSING EVENT - ', event.key);

    // adding event to database
    // await this.eventRepo.create(event);
    console.log('Added Event to DB- ', event);

    // read the event type
    const eventType = event.key;

    // fetch workflow by key and return it
    const workflow = await this.findWorkflowByKey(eventType);

    if (workflow) {
      // register workers from topic names
      const payloadTasks = event.payload.tasks;
      for (const task of payloadTasks) {
        this.registerWorkers(workflow, task);
      }

      // init the workers
      await this.initWorkers(workflow.name);

      // execute the workflow
      await this.camundaService.execute(workflow.externalIdentifier, {});

      // return workflow;
    } else {
      throw HttpErrors[404];
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

  private async registerWorkers(workflow: Workflow, task: AnyObject) {
    let cmd;
    if (task.type == 'notification') {
      cmd = new SendNotificationCommand(task.topic);
    } else if (task.type == 'workflow') {
      cmd = new InvokeWorkflowCommand(
        task.topic[0],
        task.topic[1],
        this.camundaService,
      );
    }
    if (!cmd) {
      // throw an invalid error
      return;
    }
    await this.taskOpsService.addTaskToDB(task);
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

import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Events} from '../models';
import {EventRepository} from '../repositories/event.repository';
import {TaskServiceNames} from '../types';
import {TaskOperationService} from './task-operation.service';
import {WorkflowOperationService} from './workflow-operation.service';

@injectable({
  scope: BindingScope.TRANSIENT,
})
export class EventProcessorService {
  constructor(
    @repository(EventRepository)
    private readonly eventRepo: EventRepository,
    @service(TaskOperationService)
    private readonly taskOpsService: TaskOperationService,
    @service(WorkflowOperationService)
    private readonly workflowOpsService: WorkflowOperationService,
  ) {
    // empty constuctor
  }
  public async processEvent(event: Events): Promise<void> {
    await this.eventRepo.create(event);

    const workflow = await this.workflowOpsService.execWorkflow(
      event.key,
      TaskServiceNames.EVENT,
    );

    if (workflow) {
      await this.taskOpsService.processTask(
        workflow.externalIdentifier,
        workflow.name,
        event.payload,
      );
    } else {
      throw new HttpErrors.NotFound('Workflow not found');
    }
  }
}

import {BindingScope, injectable, service} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Event} from '../models';
import {EventRepository} from '../repositories/event.repository';
import {TaskServiceNames} from '../types';
import {TaskOperationService} from './task-operation.service';
import {WorkflowOperationService} from './workflow-operation.service';
import {WebhookService} from './webhook.service';

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
    @service(WebhookService)
    private readonly webhookService: WebhookService,
  ) {}
  public async processEvent(event: Event): Promise<void> {
    await this.eventRepo.create(event);

    const workflow = await this.workflowOpsService.execWorkflow(
      event.key,
      TaskServiceNames.EVENT,
    );

    if (workflow) {
      // subscribe to tasks
      const url = await this.webhookService.getUrlOfSubscritption(event.key);
      if (url && event.payload.tasks) {
        const tasksPromises = event.payload.tasks.map((task: AnyObject) =>
          this.webhookService.addToSubscription(url, task.key),
        );
        await Promise.all(tasksPromises);
      }

      await this.taskOpsService.processTask(
        workflow.externalIdentifier,
        workflow.name,
        event.key,
        event.payload,
      );
    } else {
      throw new HttpErrors.NotFound('Workflow not found');
    }
  }
}

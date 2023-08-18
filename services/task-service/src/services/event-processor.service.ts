import {injectable, BindingScope, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {EventRepository} from '../repositories/event.repository';
import {Events} from '../models';
import {HttpErrors} from '@loopback/rest';
import {TaskOperationService} from './task-operation.service';
import {TaskServiceNames} from '../types';

@injectable({
  scope: BindingScope.SINGLETON,
})
export class EventProcessorService {
  constructor(
    @repository(EventRepository)
    private readonly eventRepo: EventRepository,
    @service(TaskOperationService)
    private readonly taskOpsService: TaskOperationService,
  ) {
    // empty constuctor
  }
  public async processEvent(event: Events): Promise<void> {
    await this.eventRepo.create(event);

    const workflow = await this.taskOpsService.execWorkflow(
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
      throw HttpErrors[404];
    }
  }
}

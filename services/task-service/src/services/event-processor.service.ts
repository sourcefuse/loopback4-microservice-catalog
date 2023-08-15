import {injectable, BindingScope, service, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {EventRepository} from '../repositories/event.repository';
import {Events} from '../models';
import {HttpErrors} from '@loopback/rest';
import {TaskOperationService} from './task-operation.service';
import {TaskServiceBindings} from '../keys';
import {BpmnRunner} from '../providers';

@injectable({
  scope: BindingScope.SINGLETON,
})
export class EventProcessorService {
  constructor(
    @repository(EventRepository)
    private readonly eventRepo: EventRepository,
    @service(TaskOperationService)
    private readonly taskOpsService: TaskOperationService,
    @inject(TaskServiceBindings.BPMN_RUNNER)
    private readonly bpmnRunner: BpmnRunner,
  ) {
    // empty constuctor
  }
  public async processEvent(event: Events): Promise<void> {
    console.log('PROCESSING EVENT - ', event.key);

    // adding event to database
    await this.eventRepo.create(event);

    const workflow = await this.taskOpsService.execWorkflow(event.key, 'event');

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

import {injectable, BindingScope, inject, service} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {EventRepository} from '../repositories/event.repository';
import {EventModel, WorkflowModel} from '../models';
import {WorkflowRepository} from '../repositories/workflow.repository';
import {HttpErrors} from '@loopback/rest';
import {CamundaService} from './camunda.service';

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
  ) {
    // empty constuctor
  }
  public async processEvent(event: EventModel): Promise<WorkflowModel> {
    console.log('Event: ', event);
    // Verify the event's body for proper task command
    // Perform actions based on the verified command

    // each event in queue should start a master workflow

    // adding event to database
    await this.eventRepo.create(event);

    // read the event type
    const eventType = event.key;

    // fetch workflow by key and return it
    const workflow = await this.findWorkflowByKey(eventType);

    if (workflow) {
      await this.camundaService.execute(workflow.id as string, {});

      return workflow;
    } else {
      throw HttpErrors[404];
    }
  }

  private async findWorkflowByKey(
    keyValue: string,
  ): Promise<WorkflowModel | null> {
    const filter: Filter<WorkflowModel> = {
      where: {
        key: keyValue,
      },
    };

    return this.workflowRepo.findOne(filter);
  }
}

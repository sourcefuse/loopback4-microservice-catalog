import {Context, inject} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {
  ExecuteWorkflowDto,
  WorkflowController,
  WorkflowRepository,
} from '@sourceloop/bpmn-service';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SYSTEM_USER} from '../constant';
import {IEvent, IEventProcessor, IIncomingConnector} from '../interfaces';
import {EventRepository, EventWorkflowMappingRepository} from '../repositories';

export class EventProcessorService implements IEventProcessor {
  incoming: IIncomingConnector;
  constructor(
    @repository(EventRepository)
    private repo: EventRepository,
    @repository(EventWorkflowMappingRepository)
    private eventWorkflowMappingRepo: EventWorkflowMappingRepository,
    @inject.context()
    private readonly ctx: Context,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
  ) {}

  async handle(event: IEvent): Promise<void> {
    await this.repo.create({
      key: event.type,
      payload: event.payload,
      source: event.payload.source ?? event.source,
      description: event.payload.description ?? `Task for ${event.type}`,
    });
    const mapping = await this.eventWorkflowMappingRepo.find({
      where: {
        eventKey: event.type,
      },
    });
    if (!mapping) {
      this.logger.debug(`No mapping found for event ${event.type}`);
      return;
    }
    const promises = mapping.map(async map => {
      await this._triggerWorkflow(map.workflowKey, event.payload);
    });
    await Promise.all(promises);
  }

  private async _triggerWorkflow(workflowKey: string, payload: AnyObject) {
    const childContext = new Context(this.ctx, 'temp-ctx');
    childContext.bind(AuthenticationBindings.CURRENT_USER).to(SYSTEM_USER);
    const workflowCtrl = await childContext.get<WorkflowController>(
      'controllers.WorkflowController',
    );
    const workflowRepo = await childContext.get<WorkflowRepository>(
      'repositories.WorkflowRepository',
    );
    const workflow = await workflowRepo.findOne({
      where: {
        externalIdentifier: workflowKey,
      },
    });
    if (!workflow) {
      this.logger.debug(`No workflow found for key ${workflowKey}`);
    } else {
      await workflowCtrl.startWorkflow(
        workflow.id!,
        new ExecuteWorkflowDto({
          input: payload,
        }),
      );
    }
    childContext.close();
  }
}

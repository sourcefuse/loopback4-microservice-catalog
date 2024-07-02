import {Context, inject} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {
  ExecuteWorkflowDto,
  WorkflowController,
  WorkflowRepository,
} from '@sourceloop/bpmn-service';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IEvent, IEventProcessor, IIncomingConnector} from '../interfaces';
import {TaskServiceBindings} from '../keys';
import {EventRepository, EventWorkflowRepository} from '../repositories';
import {EventFilter, User} from '../types';

export class EventProcessorService implements IEventProcessor {
  incoming: IIncomingConnector;
  constructor(
    @inject.context()
    private readonly ctx: Context,
    @inject(TaskServiceBindings.EVENT_FILTER)
    private readonly filter: EventFilter,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
  ) {}

  async handle(event: IEvent): Promise<void> {
    if (!this.filter(event)) {
      this.logger.debug(`Event ${event.key} filtered out`);
      return;
    }
    const tempContext = new Context(this.ctx, 'tempContext');
    const systemUser = await tempContext.get<User>(
      TaskServiceBindings.SYSTEM_USER,
    );
    tempContext.bind(AuthenticationBindings.CURRENT_USER).to(systemUser);

    const repo = await tempContext.get<EventRepository>(
      `repositories.EventRepository`,
    );
    const eventWorkflowMappingRepo =
      await tempContext.get<EventWorkflowRepository>(
        `repositories.EventWorkflowRepository`,
      );
    // need to add logic for event handling status
    await repo.create({
      key: event.key,
      payload: event.payload,
      source: event.payload.source ?? event.source,
      description: event.payload.description ?? `Task for ${event.key}`,
      timestamp: event.timestamp,
    });
    const mapping = await eventWorkflowMappingRepo.find({
      where: {
        eventKey: event.key,
      },
    });
    if (!mapping.length) {
      this.logger.debug(`No mapping found for event ${event.key}`);
      return;
    }
    const promises = mapping.map(async map => {
      await this._triggerWorkflow(map.workflowKey, event.payload, tempContext);
    });
    await Promise.all(promises);
    tempContext.close();
  }

  private async _triggerWorkflow(
    workflowKey: string,
    payload: AnyObject,
    context: Context,
  ) {
    const workflowCtrl = await context.get<WorkflowController>(
      'controllers.WorkflowController',
    );
    const workflowRepo = await context.get<WorkflowRepository>(
      'repositories.WorkflowRepository',
    );
    const workflow = await workflowRepo.findOne({
      where: {
        externalIdentifier: workflowKey,
      },
    });
    if (!workflow) {
      this.logger.debug(`No workflow found for key ${workflowKey}`);
    } else if (!workflow.id) {
      this.logger.debug(
        `Workflow found for key ${workflowKey}, but it has no id`,
      );
    } else {
      await workflowCtrl.startWorkflow(
        workflow.id,
        new ExecuteWorkflowDto({
          input: payload,
        }),
      );
    }
  }
}

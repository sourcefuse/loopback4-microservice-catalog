import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import {IEventProcessor, IIncomingConnector} from '../interfaces';
import {TaskServiceBindings} from '../keys';

@lifeCycleObserver()
export class EventStreamObserver implements LifeCycleObserver {
  constructor(
    @inject(TaskServiceBindings.EVENT_PROCESSOR)
    private readonly processor: IEventProcessor,
    @inject(TaskServiceBindings.INCOMING_CONNECTOR)
    private readonly incoming: IIncomingConnector,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
  ) {}

  async start(): Promise<void> {
    await this.incoming.subscribe(async event => this.processor.handle(event));
    this.logger.debug('Event connection started');
  }

  async stop(): Promise<void> {
    await this.incoming.unsubscribe();
    this.logger.debug('Event connection stopped');
  }
}

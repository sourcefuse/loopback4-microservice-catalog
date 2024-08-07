import {
  Constructor,
  Context,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  Setter,
} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import {
  logger as camundaLogger,
  Client,
  TopicSubscription,
} from 'camunda-external-task-client-js';
import {CAMUNDA_RETRY_INTERVAL, MAX_CAMUNDA_ATTEMPTS} from '../../constants';
import {WorkflowServiceBindings} from '../../keys';
import {
  BPMTask,
  ICommandWithTopic,
  IWorkflowServiceConfig,
  WorkerImplementationFn,
} from '../../types';
import {CLIENT} from './keys';
import {ClientWithSubscriptions} from './types';

@lifeCycleObserver()
export class TaskObserver implements LifeCycleObserver {
  client: Client;
  private readonly subscriptions: TopicSubscription[] = [];
  private attempts = 0;
  constructor(
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
    @inject(WorkflowServiceBindings.COMMANDS)
    private commandsCtors: Constructor<ICommandWithTopic>[],
    @inject.context()
    private readonly ctx: Context,
    @inject(WorkflowServiceBindings.Config)
    private readonly config: IWorkflowServiceConfig,
    @inject.setter(CLIENT)
    private readonly setClient: Setter<ClientWithSubscriptions>,
  ) {}

  async start(): Promise<void> {
    if (this.config.workflowEngineBaseUrl) {
      this.client = new Client({
        baseUrl: this.config.workflowEngineBaseUrl,
        use: camundaLogger,
        workerId: process.env.CAMUNDA_WORKER_ID ?? 'default',
        lockDuration: parseInt(process.env.LOCK_DURATION ?? '500000'),
      });
      this.setClient({
        client: this.client,
        subscriptions: this.subscriptions,
      });
    } else {
      throw new Error('Invalid workflowEngine Config');
    }
    const workerFn = await this.ctx.get<WorkerImplementationFn>(
      WorkflowServiceBindings.WorkerImplementationFunction,
    );
    this._handleEvents(this.client, workerFn);
    await this._subscribe(workerFn);
    this.logger.debug('Commands registered');
  }

  async stop(): Promise<void> {
    await this._unsubscribe();
    this.logger.debug('Stopping client');
    this.client.stop();
    this.logger.debug('Client stopped');
  }

  private async _subscribe(workerFn: WorkerImplementationFn) {
    for (const cmdCtor of this.commandsCtors) {
      const command = new cmdCtor(this.ctx);
      this.logger.debug(`Registering command ${command.topic}`);
      await workerFn({
        topic: command.topic,
        command: new BPMTask(command),
        running: false,
      });
    }
  }

  private async _unsubscribe() {
    this.logger.debug('Unsubscribing from topics');
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.logger.debug('Unsubscribed from topics');
  }

  private _handleEvents(client: Client, workerFn: WorkerImplementationFn) {
    const maxAttempts = +(
      process.env.MAX_CAMUNDA_ATTEMPTS ?? MAX_CAMUNDA_ATTEMPTS
    );
    // Default interval is 1 minute
    const defaultInterval = +(
      process.env.CAMUNDA_RETRY_INTERVAL ?? CAMUNDA_RETRY_INTERVAL
    );
    client.on('poll:error', async (error: Error) => {
      await this._unsubscribe();
      this.attempts++;
      this.logger.error(`Attempts made - ${this.attempts}`);
      this.logger.error(`Retry after - ${defaultInterval / 1000} seconds`);
      if (this.attempts <= maxAttempts) {
        setTimeout(async () => {
          await this._subscribe(workerFn);
        }, defaultInterval);
      } else {
        this.logger.error('Max attempts reached. Stopping client');
        if (!process.env.WORKER_FAILURE_CRASH_DISABLE) {
          throw new Error('Workflow client not connected');
        }
      }
    });
  }
}

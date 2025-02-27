import {
  Constructor,
  Context,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import {
  BPMTask,
  WorkerImplementationFn,
  WorkflowServiceBindings,
} from '@sourceloop/bpmn-service';
import {ICommand, ILogger, LOGGER} from '@sourceloop/core';
import {TaskServiceBindings} from '../keys';

@lifeCycleObserver()
export class CommandObserver implements LifeCycleObserver {
  constructor(
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
    @inject(TaskServiceBindings.COMMANDS)
    private readonly commandsCtors: Constructor<ICommand & {topic: string}>[],
    @inject.context()
    private readonly ctx: Context,
    @inject(WorkflowServiceBindings.WorkerImplementationFunction)
    private readonly workerFn: WorkerImplementationFn,
  ) {}

  async start(): Promise<void> {
    for (const cmdCtor of this.commandsCtors) {
      const command = new cmdCtor(this.ctx);
      this.logger.debug(`Registering command ${command.topic}`);
      await this.workerFn({
        topic: command.topic,
        command: new BPMTask(command),
        running: false,
        isInProgress: false,
      });
    }
    this.logger.debug('Commands registered');
  }

  async stop(): Promise<void> {
    // not required
  }
}

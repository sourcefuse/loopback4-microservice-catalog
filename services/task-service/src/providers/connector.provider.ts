import {
  BindingScope,
  inject,
  injectable,
  Provider,
  ContextTags,
} from '@loopback/core';
import {EventQueueConnector} from '../types';
import {TaskServiceBindings} from '../keys';
import {AnyObject} from '@loopback/repository';

@injectable({
  scope: BindingScope.SINGLETON,
  tags: {[ContextTags.KEY]: TaskServiceBindings.TASK_PROVIDER},
})
export class Connector implements Provider<EventQueueConnector> {
  name: string;
  settings: AnyObject;
  connector: EventQueueConnector;

  constructor(
    name: string,
    @inject(TaskServiceBindings.CONNECTOR_CONFIG) settings: AnyObject,
  ) {
    this.name = name;
    this.settings = settings;
    // Initialize the connector here
    // Example: this.connector = new CustomEventQueueConnector(settings);
  }

  value(): Promise<EventQueueConnector> {
    return Promise.resolve(this.connector);
  }

  async connect(settings: AnyObject): Promise<EventQueueConnector> {
    // Connection logic goes here
    // Example: this.connector.connect(settings);
    return this.connector;
  }

  async disconnect(settings: AnyObject): Promise<void> {
    // Disconnection logic goes here
    // Example: this.connector.disconnect(settings);
  }

  async ping(): Promise<void> {
    // Health check logic goes here
    // Example: return this.connector.ping();
  }
}

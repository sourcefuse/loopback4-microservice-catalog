import {
  BindingScope,
  Component,
  ControllerClass,
  CoreBindings,
  ServiceOrProviderClass,
  inject,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {TaskServiceBindings} from '../../keys';
import {
  ClientAppController,
  EventTriggerController,
  WebhookSubscriptionController,
} from './controllers';
import {HttpStreamService} from './http-stream.service';
import {
  ClientAppRepository,
  WebhookSubscriptionRepository,
} from './repositories';
import {ApiKeyService, WebhookService} from './services';

export class TaskHttpComponent implements Component {
  controllers?: ControllerClass[];
  repositories?: Class<Repository<Model>>[];
  services?: ServiceOrProviderClass[];
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private app: RestApplication,
  ) {
    this.controllers = [
      ClientAppController,
      WebhookSubscriptionController,
      EventTriggerController,
    ];
    this.repositories = [ClientAppRepository, WebhookSubscriptionRepository];
    this.services = [ApiKeyService, WebhookService];
    this.app
      .bind(TaskServiceBindings.INCOMING_CONNECTOR)
      .toClass(HttpStreamService)
      .inScope(BindingScope.SINGLETON);
    this.app
      .bind(TaskServiceBindings.OUTGOING_CONNECTOR)
      .toClass(HttpStreamService)
      .inScope(BindingScope.SINGLETON);
  }
}

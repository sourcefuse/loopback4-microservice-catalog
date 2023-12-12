import {
  Component,
  ControllerClass,
  ServiceOrProviderClass,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {WebhookSubscriptionController} from './controllers';
import {ApiKeyController} from './controllers/api-key.controller';
import {ApiKeyRepository, WebhookSubscriptionsRepository} from './repositories';
import {ApiKeyVerificationService, WebhookService} from './services';

export class TaskHttpComponent implements Component {
  controllers?: ControllerClass[] | undefined;
  repositories?: Class<Repository<Model>>[];
  services?: ServiceOrProviderClass[] | undefined;
  constructor() {
    this.controllers = [ApiKeyController, WebhookSubscriptionController];
    this.repositories = [ApiKeyRepository, WebhookSubscriptionsRepository];
    this.services = [ApiKeyVerificationService, WebhookService];
  }
}

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {EventQueueService} from './services';
import {SQSConnector} from './providers';
import * as controllers from './controllers';
import * as services from './services';

export class TaskServiceComponent implements Component {
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  providers: ProviderMap = {};

  services = [services.EventQueueService];
  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];
  bindings?: Binding[] = [
    Binding.bind('sqs.config').to({
      accessKeyId: process.env.AWS_SQS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SQS_SECRET_KEY,
      region: process.env.AWS_SQS_REGION,
      queueUrl: process.env.AWS_SQS_URL,
    }),
    Binding.bind('event-queue.connector').toProvider(SQSConnector),
    Binding.bind('services.EventQueueService').toClass(EventQueueService),
  ];
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    this.application.component(CoreComponent);

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Task Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });
    this.controllers = [controllers.EventQueueController];
  }

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   */
  setupSequence() {
    this.application.sequence(ServiceSequence);
  }
}

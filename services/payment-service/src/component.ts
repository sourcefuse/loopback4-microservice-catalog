import {
  Application,
  injectable,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
  ControllerClass,
  Binding,
  ProviderMap,
} from '@loopback/core';
import {PaymentServiceComponentBindings} from './keys';
import {CoreComponent} from '@sourceloop/core';
import {Class, Model, Repository} from '@loopback/repository';
import {
  DEFAULT_PAYMENT_SERVICE_OPTIONS,
  PaymentServiceComponentOptions,
} from './types';
import {Orders, Transactions} from './models';
import {OrdersController, TransactionsController} from './controllers';
import {OrdersRepository, TransactionsRepository} from './repositories';
import {RazorpayProvider, GatewayProvider, StripeProvider} from './providers';

// Configure the binding for PaymentServiceComponent
@injectable({
  tags: {[ContextTags.KEY]: PaymentServiceComponentBindings.COMPONENT},
})
export class PaymentServiceComponent implements Component {
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];
  bindings?: Binding[];
  providers?: ProviderMap = {};
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @config()
    private options: PaymentServiceComponentOptions = DEFAULT_PAYMENT_SERVICE_OPTIONS,
  ) {
    this.application.component(CoreComponent);
    this.models = [Orders, Transactions];
    this.controllers = [OrdersController, TransactionsController];
    this.repositories = [OrdersRepository, TransactionsRepository];
    this.providers = {
      RazorpayProvider,
      StripeProvider,
      GatewayProvider,
    };
  }
}

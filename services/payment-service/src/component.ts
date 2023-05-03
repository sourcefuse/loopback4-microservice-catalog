// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Application,
  Binding,
  Component,
  ContextTags,
  ControllerClass,
  CoreBindings,
  ProviderMap,
  config,
  inject,
  injectable,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {CoreComponent} from '@sourceloop/core';
import {
  OrdersController,
  PaymentGatewaysController,
  SubscriptionTransactionsController,
  SubscriptionsController,
  TemplatesController,
  TransactionSubscriptionsController,
  TransactionsController,
} from './controllers';
import {PaymentServiceComponentBindings} from './keys';
import {
  Orders,
  PaymentGateways,
  Subscriptions,
  Templates,
  Transactions,
} from './models';
import {
  GatewayBindings,
  GatewayProvider,
  RazorpayBindings,
  RazorpayProvider,
  StripeBindings,
  StripeProvider,
} from './providers';
import {PayPalBindings, PaypalProvider} from './providers/paypal';
import {
  OrdersRepository,
  PaymentGatewaysRepository,
  SubscriptionsRepository,
  TemplatesRepository,
  TransactionsRepository,
} from './repositories';
import {
  DEFAULT_PAYMENT_SERVICE_OPTIONS,
  PaymentServiceComponentOptions,
} from './types';

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
  bindings?: Binding[] = [];
  providers?: ProviderMap = {};
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: Application,
    @config()
    private readonly options: PaymentServiceComponentOptions = DEFAULT_PAYMENT_SERVICE_OPTIONS,
  ) {
    this.bindings = [
      Binding.bind(RazorpayBindings.RazorpayHelper.key).to(null),
      Binding.bind(StripeBindings.StripeHelper.key).to(null),
      Binding.bind(PayPalBindings.PayPalHelper.key).to(null),
    ];
    this.application.component(CoreComponent);
    this.models = [
      Orders,
      Transactions,
      PaymentGateways,
      Templates,
      Subscriptions,
    ];
    this.controllers = [
      OrdersController,
      TransactionsController,
      PaymentGatewaysController,
      TemplatesController,
      SubscriptionsController,
      SubscriptionTransactionsController,
      TransactionSubscriptionsController,
    ];
    this.repositories = [
      OrdersRepository,
      TransactionsRepository,
      PaymentGatewaysRepository,
      TemplatesRepository,
      SubscriptionsRepository,
    ];
    this.providers = {
      [GatewayBindings.GatewayHelper.key]: GatewayProvider,
      [RazorpayBindings.RazorpayHelper.key]: RazorpayProvider,
      [StripeBindings.StripeHelper.key]: StripeProvider,
      [PayPalBindings.PayPalHelper.key]: PaypalProvider,
    };
  }
}

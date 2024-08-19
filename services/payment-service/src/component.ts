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
import {
  CoreComponent,
  ITenantUtilitiesConfig,
  TenantUtilitiesBindings,
  TenantUtilitiesComponent,
} from '@sourceloop/core';
import {
  OrdersController,
  PaymentGatewaysController,
  SubscriptionTransactionsController,
  SubscriptionsController,
  TemplatesController,
  TransactionSubscriptionsController,
  TransactionsController,
} from './controllers';
import {PaymentServiceBindings, PaymentServiceComponentBindings} from './keys';
import {
  Orders,
  PaymentGateways,
  Subscriptions,
  Templates,
  Transactions,
} from './models';

import {
  Orders as TenantOrders,
  PaymentGateways as TenantPaymentGateways,
  Subscriptions as TenantSubscriptions,
  Templates as TenantTemplates,
  Transactions as TenantTransactions,
} from './models/tenant-support';
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
  OrdersRepository as OrdersSequelizeRepository,
  PaymentGatewaysRepository as PaymentGatewaysSequelizeRepository,
  SubscriptionsRepository as SubscriptionsSequelizeRepository,
  TemplatesRepository as TemplatesSequelizeRepository,
  TransactionsRepository as TransactionsSequelizeRepository,
} from './repositories/sequelize';
import {
  DEFAULT_PAYMENT_SERVICE_OPTIONS,
  PaymentServiceComponentOptions,
  PaymentServiceConfig,
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
    @inject(PaymentServiceBindings.Config, {optional: true})
    private readonly paymentConfig?: PaymentServiceConfig,
    @config()
    private readonly options: PaymentServiceComponentOptions = DEFAULT_PAYMENT_SERVICE_OPTIONS,
    @inject(TenantUtilitiesBindings.Config, {optional: true})
    private readonly tenantConfig?: ITenantUtilitiesConfig,
  ) {
    this.bindings = [
      Binding.bind(RazorpayBindings.RazorpayHelper.key).to(null),
      Binding.bind(StripeBindings.StripeHelper.key).to(null),
      Binding.bind(PayPalBindings.PayPalHelper.key).to(null),
    ];
    this.application.component(CoreComponent);

    if (this.tenantConfig?.useSingleTenant) {
      this.models = [
        Orders,
        Transactions,
        PaymentGateways,
        Templates,
        Subscriptions,
      ];
    } else {
      this.models = [
        TenantOrders,
        TenantPaymentGateways,
        TenantSubscriptions,
        TenantTemplates,
        TenantTransactions,
      ];
    }
    this.application.component(TenantUtilitiesComponent);
    this.controllers = [
      OrdersController,
      TransactionsController,
      PaymentGatewaysController,
      TemplatesController,
      SubscriptionsController,
      SubscriptionTransactionsController,
      TransactionSubscriptionsController,
    ];

    if (this.paymentConfig?.useSequelize) {
      this.repositories = [
        OrdersSequelizeRepository,
        TransactionsSequelizeRepository,
        PaymentGatewaysSequelizeRepository,
        TemplatesSequelizeRepository,
        SubscriptionsSequelizeRepository,
      ];
    } else {
      this.repositories = [
        OrdersRepository,
        TransactionsRepository,
        PaymentGatewaysRepository,
        TemplatesRepository,
        SubscriptionsRepository,
      ];
    }
    this.providers = {
      [GatewayBindings.GatewayHelper.key]: GatewayProvider,
      [RazorpayBindings.RazorpayHelper.key]: RazorpayProvider,
      [StripeBindings.StripeHelper.key]: StripeProvider,
      [PayPalBindings.PayPalHelper.key]: PaypalProvider,
    };
  }
}

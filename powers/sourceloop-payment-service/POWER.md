---
name: 'sourceloop-payment-service'
displayName: 'SourceLoop Payment Service'
description: 'Process payments with PayPal, Stripe, and Razorpay - manage orders, transactions, subscriptions, and refunds via LoopBack 4'
keywords:
  [
    'payment',
    'stripe',
    'paypal',
    'razorpay',
    'checkout',
    'transaction',
    'subscription',
    'refund',
    'sourceloop',
  ]
author: 'SourceFuse'
---

# SourceLoop Payment Service

## Overview

A LoopBack 4 microservice for payment processing supporting multiple payment gateways. Integrates with PayPal, Stripe, and Razorpay for order management, transaction tracking, subscription handling, and refund processing.

**Key capabilities:**

- **Multi-gateway Support**: PayPal, Stripe, and Razorpay integration
- **Order Management**: Create and manage payment orders
- **Transaction Tracking**: Full transaction lifecycle tracking
- **Subscriptions**: Recurring payment support across gateways
- **Refunds**: Full and partial refund processing
- **Templates**: Payment page templates via Handlebars

## Available MCP Servers

### sourceloop-cli

**Package:** `@sourceloop/cli`
**Connection:** Local stdio via npx

Use the `microservice` tool with `--baseOnService --baseService=payment-service` to scaffold a new payment service instance.

## Installation

```typescript
import {PaymentServiceComponent} from '@sourceloop/payment-service';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Validate payment gateway configuration
    this.validatePaymentEnv();

    try {
      this.component(PaymentServiceComponent);
      console.log('✅ Payment service loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize payment service:', error.message);
      throw error;
    }
  }

  private validatePaymentEnv() {
    const required = ['DB_HOST', 'DB_PORT'];
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }

    // Validate at least one payment gateway is configured
    const hasStripe = process.env.STRIPE_SECRET_KEY;
    const hasPaypal =
      process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET;
    const hasRazorpay =
      process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;

    if (!hasStripe && !hasPaypal && !hasRazorpay) {
      throw new Error(
        'At least one payment gateway must be configured (Stripe/PayPal/Razorpay)',
      );
    }

    // Warn about mixing test and production credentials
    if (process.env.NODE_ENV === 'production') {
      if (process.env.STRIPE_SECRET_KEY?.includes('_test_')) {
        throw new Error(
          'Production environment detected with Stripe test credentials',
        );
      }
    }
  }
}
```

## Key Models

- **Orders** - Payment order with amount, currency, status
- **Transactions** - Transaction records linked to orders
- **PaymentGateways** - Gateway configuration (PayPal, Stripe, Razorpay)
- **Subscriptions** - Recurring payment subscriptions
- **Templates** - Handlebars templates for payment pages

## Key Controllers

- **OrdersController** - Order CRUD and payment initiation
- **TransactionsController** - Transaction tracking and status
- **PaymentGatewaysController** - Gateway configuration management
- **SubscriptionsController** - Subscription lifecycle management
- **TemplatesController** - Payment template management

## Common Workflows

### Workflow 1: Setup Payment Service

```bash
npx @sourceloop/cli microservice my-payments \
  --baseOnService \
  --baseService=payment-service \
  --datasourceName=paymentdb \
  --datasourceType=postgresql \
  --includeMigrations

# After scaffolding, add these verification steps:
cd my-payments

# Test database connection
npm run db:ping

# Run migrations and verify
npm run db:migrate
npm run db:migrate:status

# Verify service starts
npm run build
npm start &
curl http://localhost:3000/ping
```

**Critical validation checklist:**

- ✅ Database connectivity verified
- ✅ All migrations applied successfully
- ✅ Service starts without errors
- ✅ Health endpoint responds

### Workflow 2: Create a Payment Order

```typescript
const order = await ordersRepo.create({
  totalAmount: 2999,
  currency: 'USD',
  status: 'draft',
  paymentGatewayId: stripeGatewayId,
});
```

## Environment Variables

| Variable               | Description           |
| ---------------------- | --------------------- |
| `PAYPAL_CLIENT_ID`     | PayPal client ID      |
| `PAYPAL_CLIENT_SECRET` | PayPal client secret  |
| `STRIPE_SECRET_KEY`    | Stripe secret API key |
| `RAZORPAY_KEY_ID`      | Razorpay key ID       |
| `RAZORPAY_KEY_SECRET`  | Razorpay key secret   |

## Best Practices

### Do:

- Use integer cents for all monetary values (never floats)
- Implement webhook handlers for async payment events
- Use idempotency keys for payment creation
- Store gateway credentials in environment variables
- Handle payment failures gracefully with retry logic

### Don't:

- Use floating-point numbers for money calculations
- Store payment card data - rely on gateway tokenization
- Skip webhook signature verification
- Mix test and production gateway credentials
- Process refunds without validating the original transaction

## Testing

### Unit Tests

```typescript
import {createStubInstance, expect} from '@loopback/testlab';
import {OrdersController} from '../controllers';
import {OrdersRepository, PaymentGatewaysRepository} from '../repositories';
import {StripeProvider} from '../providers';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersRepo: sinon.SinonStubbedInstance<OrdersRepository>;
  let stripeProvider: sinon.SinonStubbedInstance<StripeProvider>;

  beforeEach(() => {
    ordersRepo = createStubInstance(OrdersRepository);
    stripeProvider = {charge: sinon.stub().resolves({id: 'ch_123', status: 'succeeded'})};
    controller = new OrdersController(ordersRepo, stripeProvider);
  });

  it('should process payment with valid order', async () => {
    const order = {id: '1', totalAmount: 2999, currency: 'USD', status: 'draft'};
    ordersRepo.findById.resolves(order);
    
    const result = await controller.processPayment('1');
    
    sinon.assert.calledOnce(stripeProvider.charge);
    expect(result).to.have.property('status', 'succeeded');
  });

  it('should handle payment gateway failure', async () => {
    stripeProvider.charge.rejects(new Error('Card declined'));
    
    await expect(controller.processPayment('1')).to.be.rejectedWith('Card declined');
  });

  it('should use integer cents for amounts', async () => {
    const order = {totalAmount: 29.99}; // Wrong: float
    await expect(ordersRepo.create(order)).to.be.rejected();
    
    const correctOrder = {totalAmount: 2999}; // Correct: integer cents
    await ordersRepo.create(correctOrder);
  });
});
```

### Integration Tests with Mock Gateway

```typescript
import {Client, expect} from '@loopback/testlab';
import {PaymentApplication} from '../application';

class MockStripeProvider {
  async charge(order: any) {
    // Mock Stripe charge
    return {id: `ch_mock_${Date.now()}`, status: 'succeeded', amount: order.totalAmount};
  }
  
  async refund(chargeId: string) {
    return {id: `re_mock_${Date.now()}`, status: 'succeeded'};
  }
}

describe('Payment API', () => {
  let app: PaymentApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    app.bind('services.StripeProvider').toClass(MockStripeProvider);
  });

  it('POST /orders/:id/charge processes payment', async () => {
    const order = await client.post('/orders').send({
      totalAmount: 4999,
      currency: 'USD',
      paymentGatewayId: 'stripe-gateway-id',
    });
    
    const res = await client.post(`/orders/${order.body.id}/charge`).expect(200);
    
    expect(res.body).to.have.property('transactionId');
    expect(res.body.status).to.equal('paid');
  });

  it('POST /orders/:id/refund processes refund', async () => {
    const res = await client.post('/orders/order-123/refund').send({amount: 2999}).expect(200);
    
    expect(res.body).to.have.property('refundId');
  });
});
```
### Testing Best Practices

- Mock all payment gateway providers (Stripe, PayPal, Razorpay)
- Test currency conversion and rounding
- Verify idempotency for retry scenarios
- Test webhook signature verification
- Validate against PCI DSS requirements in tests

## Database

Requires PostgreSQL. Run migrations:

```bash
npx db-migrate up --config database.json --migrations-dir migrations
```

## Dependencies

- `@sourceloop/core`
- `@paypal/checkout-server-sdk`
- `stripe`
- `razorpay`
- `handlebars`

---
name: "sourceloop-payment-service"
displayName: "SourceLoop Payment Service"
description: "Process payments with PayPal, Stripe, and Razorpay - manage orders, transactions, subscriptions, and refunds via LoopBack 4"
keywords: ["payment", "stripe", "paypal", "razorpay", "checkout", "transaction", "subscription", "refund", "sourceloop"]
author: "SourceFuse"
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

export class MyApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(PaymentServiceComponent);
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
```

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

| Variable | Description |
|----------|-------------|
| `PAYPAL_CLIENT_ID` | PayPal client ID |
| `PAYPAL_CLIENT_SECRET` | PayPal client secret |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |

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

/* Replace with your SQL commands */

ALTER TABLE main.orders
ADD IF NOT EXISTS tenant_id uuid  NOT NULL;

ALTER TABLE main.paymentgateways
ADD IF NOT EXISTS tenant_id uuid  NOT NULL;

ALTER TABLE main.templates
ADD IF NOT EXISTS tenant_id uuid  NOT NULL;

ALTER TABLE main.transactions
ADD IF NOT EXISTS tenant_id uuid  NOT NULL;

ALTER TABLE main.subscriptions
ADD IF NOT EXISTS tenant_id uuid  NOT NULL;
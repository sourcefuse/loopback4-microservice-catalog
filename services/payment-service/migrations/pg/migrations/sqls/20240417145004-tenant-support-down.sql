/* Replace with your SQL commands */

-- Drop the tenant_id column from main.jobs table
ALTER TABLE main.orders
DROP COLUMN IF EXISTS tenant_id;

-- Drop the tenant_id column from main.jobs table
ALTER TABLE main.paymentgateways
DROP COLUMN IF EXISTS tenant_id;

-- Drop the tenant_id column from main.jobs table
ALTER TABLE main.templates
DROP COLUMN IF EXISTS tenant_id;

-- Drop the tenant_id column from main.jobs table
ALTER TABLE main.transactions
DROP COLUMN IF EXISTS tenant_id;

-- Drop the tenant_id column from main.jobs table
ALTER TABLE main.subscriptions
DROP COLUMN IF EXISTS tenant_id;
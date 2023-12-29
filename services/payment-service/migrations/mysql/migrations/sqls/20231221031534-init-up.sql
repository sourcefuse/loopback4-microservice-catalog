-- creating Payment Gateways table
CREATE TABLE paymentgateways ( 
	id                   VARCHAR(36) NOT NULL PRIMARY KEY,
	name                 VARCHAR(100) NOT NULL,
	gateway_type         VARCHAR(100) NOT NULL,
	enabled              BOOLEAN NOT NULL
 );

-- adding triggers
CREATE TRIGGER before_insert_trigger_paymentgateways
BEFORE INSERT ON paymentgateways
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating Templates table
CREATE TABLE templates ( 
	id                   VARCHAR(36) NOT NULL PRIMARY KEY,
	payment_gateway_id   VARCHAR(36) NOT NULL,
	name                 VARCHAR(255) NOT NULL,
	`template`           TEXT NOT NULL,
	type                 VARCHAR(255) NOT NULL
 );

-- adding triggers
CREATE TRIGGER before_insert_trigger_templates
BEFORE INSERT ON templates
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating Orders table
CREATE TABLE orders ( 
	id                   VARCHAR(36) NOT NULL PRIMARY KEY,
	totalamount          NUMERIC NOT NULL,
	status               VARCHAR(100) NOT NULL,
	paymentmethod        VARCHAR(100),
	paymentgatewayid     VARCHAR(36),
	metadata             JSON,
	currency             VARCHAR(255)
 );

-- adding triggers
CREATE TRIGGER before_insert_trigger_orders
BEFORE INSERT ON orders
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- creating Transactions table
CREATE TABLE transactions ( 
	id                   VARCHAR(36) NOT NULL PRIMARY KEY,
	amount_paid          NUMERIC NOT NULL,
	status               VARCHAR(100),
	order_id             VARCHAR(36),
	payment_gateway_id   VARCHAR(36),
	res                  JSON,
	paid_date            DATE,
	currency             VARCHAR(255)
 );

-- adding triggers
CREATE TRIGGER before_insert_trigger_transactions
BEFORE INSERT ON transactions
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

CREATE TRIGGER before_insert_trigger_transactions_paid_date
BEFORE INSERT ON transactions
FOR EACH ROW
SET NEW.paid_date = IFNULL(NEW.paid_date, current_date());

-- creating Subscriptions table
CREATE TABLE subscriptions ( 
	id                       VARCHAR(36) NOT NULL PRIMARY KEY,
	currency                 VARCHAR(255),
	status                   VARCHAR(255),
	payment_gateway_id       VARCHAR(36),
	payment_method           VARCHAR(255),
	metadata                 JSON,
	start_date               DATE,
	end_date                 DATE,
	total_amount             NUMERIC,
	gateway_subscription_id  VARCHAR(255),
	plan_id                  VARCHAR(255)
 );

-- adding triggers
CREATE TRIGGER before_insert_trigger_subscriptions
BEFORE INSERT ON subscriptions
FOR EACH ROW
SET NEW.id = IFNULL(NEW.id, uuid());

-- Adding all foriegn keys
ALTER TABLE orders ADD CONSTRAINT fk_orders_payment_gateways FOREIGN KEY (paymentgatewayid) REFERENCES paymentgateways(id);
ALTER TABLE templates ADD CONSTRAINT fk_templates_paymentgateways FOREIGN KEY (payment_gateway_id) REFERENCES paymentgateways(id);
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_orders FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE transactions ADD CONSTRAINT fk_transactions FOREIGN KEY (payment_gateway_id) REFERENCES paymentgateways(id);


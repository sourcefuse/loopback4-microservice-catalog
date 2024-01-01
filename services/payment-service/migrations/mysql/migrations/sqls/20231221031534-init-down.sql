ALTER TABLE orders
DROP FOREIGN KEY fk_orders_payment_gateways;

ALTER TABLE templates
DROP FOREIGN KEY fk_templates_paymentgateways;

ALTER TABLE transactions
DROP FOREIGN KEY fk_transactions_orders;

ALTER TABLE transactions
DROP FOREIGN KEY fk_transactions;

DROP TABLE paymentgateways;
DROP TABLE templates;
DROP TABLE orders;
DROP TABLE transactions;
DROP TABLE subscriptions;

CREATE SCHEMA IF NOT EXISTS main;

CREATE  TABLE main.paymentgateways ( 
	id                   uuid  NOT NULL ,
	name                 varchar  NOT NULL ,
	gateway_type         varchar  NOT NULL ,
	enabled              boolean  NOT NULL ,
	CONSTRAINT paymentgateways_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE main.templates ( 
	id                   uuid  NOT NULL ,
	payment_gateway_id   uuid  NOT NULL ,
	name                 varchar  NOT NULL ,
	"template"           text  NOT NULL ,
	CONSTRAINT templates_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE main.orders ( 
	id                   uuid  NOT NULL ,
	totalamount          numeric  NOT NULL ,
	status               varchar(100)  NOT NULL ,
	paymentmethod        varchar(100)   ,
	paymentgatewayid     uuid   ,
	metadata             json   ,
	currency             varchar   ,
	CONSTRAINT pk_orders_id PRIMARY KEY ( id )
 );

CREATE  TABLE main.transactions ( 
	id                   uuid  NOT NULL ,
	amount_paid          numeric  NOT NULL ,
	status               varchar(100)   ,
	order_id             uuid  NOT NULL ,
	payment_gateway_id   uuid   ,
	res                  json   ,
	paid_date            date DEFAULT CURRENT_DATE  ,
	currency             varchar   ,
	CONSTRAINT pk_transactions_id PRIMARY KEY ( id )
 );

ALTER TABLE main.orders ADD CONSTRAINT fk_orders_payment_gateways FOREIGN KEY ( paymentgatewayid ) REFERENCES main.paymentgateways( id );

ALTER TABLE main.templates ADD CONSTRAINT fk_templates_paymentgateways FOREIGN KEY ( payment_gateway_id ) REFERENCES main.paymentgateways( id );

ALTER TABLE main.transactions ADD CONSTRAINT fk_transactions_orders FOREIGN KEY ( order_id ) REFERENCES main.orders( id );

ALTER TABLE main.transactions ADD CONSTRAINT fk_transactions FOREIGN KEY ( payment_gateway_id ) REFERENCES main.paymentgateways( id );

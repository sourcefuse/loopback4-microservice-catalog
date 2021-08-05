CREATE SCHEMA IF NOT EXISTS main;

CREATE  TABLE main.orders (
	id                   uuid  NOT NULL ,
	totalamount          numeric  NOT NULL ,
	status               varchar(100)  NOT NULL ,
	paymentmethod        varchar(100)   ,
	paymentgatewayid     uuid   ,
	metadata             json   ,
	CONSTRAINT pk_orders_id PRIMARY KEY ( id )
 );

CREATE  TABLE main.paymentgateways (
	id                   uuid  NOT NULL ,
	name                 varchar(250)   ,
	gateway_type         varchar(100)   ,
	enabled              boolean   ,
	CONSTRAINT pk_payment_gateways_id PRIMARY KEY ( id )
 );

CREATE  TABLE main.transactions (
	id                   uuid  NOT NULL ,
	amount_paid          numeric  NOT NULL ,
	status               varchar(100)   ,
	order_id             uuid  NOT NULL ,
	payment_gateway_id   uuid   ,
	res                  json   ,
	paid_date            date DEFAULT current_date  ,
	CONSTRAINT pk_transactions_id PRIMARY KEY ( id ),
	CONSTRAINT fk_transactions_orders FOREIGN KEY ( order_id ) REFERENCES main.orders( id )
 );

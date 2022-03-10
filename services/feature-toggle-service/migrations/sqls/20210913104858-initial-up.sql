CREATE SCHEMA main;

SET search_path TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE TABLE main.features (
	id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
	name            varchar(50)  NOT NULL ,
	description        varchar(50) ,
	default_value         bool DEFAULT true NOT NULL ,
	CONSTRAINT pk_features_id PRIMARY KEY ( id )
 );

 CREATE TABLE main.strategies (
	id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
	name            varchar(50)  NOT NULL ,
	priority        integer ,
	CONSTRAINT pk_strategies_id PRIMARY KEY ( id )
 );

 CREATE TABLE main.feature_toggles (
	id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
	feature_id            uuid  NOT NULL ,
	strategy_id        uuid  NOT NULL ,
  item_id        uuid  NOT NULL ,
	status         bool DEFAULT true NOT NULL ,
	CONSTRAINT pk_feature_toggles_id PRIMARY KEY ( id )
 );


ALTER TABLE main.feature_toggles ADD CONSTRAINT fk_feature_toggles_feature FOREIGN KEY ( feature_id ) REFERENCES main.features( id );

ALTER TABLE main.feature_toggles ADD CONSTRAINT fk_feature_toggles_strategies FOREIGN KEY ( feature_id ) REFERENCES main.strategies( id );

INSERT INTO main.strategies(name, priority)
	VALUES ('System', '1');

INSERT INTO main.strategies(name, priority)
	VALUES ('Tenant', '2');

INSERT INTO main.strategies(name, priority)
	VALUES ('User', '3');
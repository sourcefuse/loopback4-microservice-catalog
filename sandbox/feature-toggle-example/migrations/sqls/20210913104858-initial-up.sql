CREATE SCHEMA main;

SET search_path TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE TABLE main.features (
	id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
	name            varchar(50)  NOT NULL ,
	key            varchar(50)  NOT NULL ,
	description        varchar(50) ,
	default_value         bool DEFAULT true NOT NULL ,
	CONSTRAINT pk_features_id PRIMARY KEY ( id )
 );

 CREATE TABLE main.strategies (
	id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
	name            varchar(50)  NOT NULL ,
	key            varchar(50)  NOT NULL ,
	priority        integer ,
	CONSTRAINT pk_strategies_id PRIMARY KEY ( id )
 );

 CREATE TABLE main.feature_toggles (
	id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL,
	feature_key            varchar(50)  NOT NULL ,
	strategy_key            varchar(50)  NOT NULL ,
  strategy_entity_id        uuid ,
	status         bool DEFAULT true NOT NULL ,
	CONSTRAINT pk_feature_toggles_id PRIMARY KEY ( id )
 );

INSERT INTO main.strategies(name, key, priority)
	VALUES ('System', 'System', '1');

INSERT INTO main.strategies(name, key, priority)
	VALUES ('Tenant', 'Tenant', '2');

INSERT INTO main.strategies(name, key, priority)
	VALUES ('User', 'User', '3');

INSERT INTO main.features(name, key, default_value)
  VALUES ('Calendar', 'Calendar', 'true');
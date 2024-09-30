CREATE SCHEMA IF NOT EXISTS core;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE  TABLE core.dashboards ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	name                 varchar(100)    ,
	created_by           varchar    ,
	modified_by          varchar    ,
	created_on           timestamp(6)    ,
	modified_on          timestamp(6)    ,
	deleted              boolean    ,
	description          text    ,
	layout               jsonb    ,
	ext_id               varchar    ,
	ext_metadata         jsonb    ,
	deleted_on           time    ,
	deleted_by           varchar    ,
	CONSTRAINT pk_dashboards PRIMARY KEY ( id )
 );

CREATE  TABLE core.data_sets ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	name                 varchar(100)    ,
	ext_id               varchar    ,
	data_set_query       jsonb  NOT NULL  ,
	created_by           varchar    ,
	modified_by          varchar    ,
	created_on           timestamp(6)    ,
	modified_on          timestamp(6)    ,
	deleted              boolean DEFAULT false   ,
	ext_metadata         jsonb    ,
	data_set_query_hash  text    ,
	deleted_on           timestamp(6)    ,
	deleted_by           varchar    ,
	CONSTRAINT pk_datasets PRIMARY KEY ( id )
 );

CREATE  TABLE core.ingestion_mapping ( 
	datasource_name      varchar(100)  NOT NULL  ,
	record_type          varchar(100)    ,
	primary_column       varchar    ,
	permissions          jsonb    ,
	column_transformations jsonb    ,
	CONSTRAINT pk_ingestion_mapping PRIMARY KEY ( datasource_name )
 );

CREATE  TABLE core.state_tracking ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	"state"              varchar(255)  NOT NULL  ,
	payload              text    ,
	record_type          varchar(255)  NOT NULL  ,
	"timestamp"          timestamptz(6)  NOT NULL  ,
	error                text    ,
	record_id            varchar(255)  NOT NULL  ,
	CONSTRAINT state_tracking_pkey PRIMARY KEY ( id )
 );


CREATE  TABLE core.widgets ( 
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	name                 varchar(100)    ,
	dataset_id           uuid    ,
	visualization_type   varchar    ,
	ext_id               varchar    ,
	created_by           varchar    ,
	modified_by          varchar    ,
	created_on           timestamp(6)    ,
	modified_on          timestamp(6)    ,
	deleted              boolean DEFAULT false   ,
	ext_metadata         jsonb    ,
	deleted_on           time    ,
	deleted_by           varchar    ,
	CONSTRAINT pk_widgets PRIMARY KEY ( id )
 );

CREATE  TABLE core.dashboard_widgets ( 
	dashboard_id         uuid  NOT NULL  ,
	widget_id            uuid  NOT NULL  ,
	id                   uuid DEFAULT uuid_generate_v4() NOT NULL  ,
	CONSTRAINT dashboard_widgets_pkey PRIMARY KEY ( id )
 );

ALTER TABLE core.dashboard_widgets ADD CONSTRAINT dashboard_widgets_dashboard_id_fkey FOREIGN KEY ( dashboard_id ) REFERENCES core.dashboards( id ) ON DELETE CASCADE;

ALTER TABLE core.dashboard_widgets ADD CONSTRAINT dashboard_widgets_widget_id_fkey FOREIGN KEY ( widget_id ) REFERENCES core.widgets( id ) ON DELETE CASCADE;

ALTER TABLE core.widgets ADD CONSTRAINT fk_widgets_datasets FOREIGN KEY ( dataset_id ) REFERENCES core.data_sets( id );

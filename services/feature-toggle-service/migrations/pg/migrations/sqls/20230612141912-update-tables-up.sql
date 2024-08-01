/* Replace with your SQL commands */

ALTER TABLE main.features
ADD metadata TEXT,  
ADD created_by varchar(100),
ADD modified_by varchar(100),
ADD created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
ADD modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
ADD deleted              bool DEFAULT false NOT NULL ,
ADD deleted_on           timestamptz   ,
ADD deleted_by           uuid   ;

ALTER TABLE main.strategies
ADD created_by varchar(100),
ADD modified_by varchar(100),
ADD created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
ADD modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
ADD deleted              bool DEFAULT false NOT NULL ,
ADD deleted_on           timestamptz   ,
ADD deleted_by           uuid   ;

ALTER TABLE main.feature_values
ADD created_by varchar(100),
ADD modified_by varchar(100),
ADD created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
ADD modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
ADD deleted              bool DEFAULT false NOT NULL ,
ADD deleted_on           timestamptz   ,
ADD deleted_by           uuid   ;
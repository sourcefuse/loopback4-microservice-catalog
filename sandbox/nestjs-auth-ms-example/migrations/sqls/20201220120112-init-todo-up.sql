CREATE TABLE main.todos (
	id                   uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL ,
	title                varchar(50)  NOT NULL ,
	description          varchar(100)   ,
	created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	created_by           uuid   ,
	modified_by          uuid   ,
	deleted              bool DEFAULT false NOT NULL ,
	items                _text  ,
	deleted_by           uuid   ,
	deleted_on           timestamptz   ,
	CONSTRAINT pk_todos_id PRIMARY KEY ( id )
 );

CREATE trigger mdt_todos BEFORE UPDATE ON main.todos for each ROW EXECUTE PROCEDURE main.moddatetime('modified_on');

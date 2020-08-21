# in-mail-service

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

A Loopback Microservice primarily used for in-mail implemetation to compose, view in-mails for
any client application

## Installation

```bash
   npm i @sourceloop/inmail-service
```

## Implementation

### Migration
First of all we need to set up migration for the in-mail database.
The query for Migration is given below.

```sql
DROP SCHEMA IF EXISTS main
CASCADE;
CREATE SCHEMA main; -- We need to set up database in the main schema. If this schema is already used, please consider creating another database.
SET search_path TO main, public, logs;

CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE TYPE visibility_type AS enum
('read', 'new','unread');

CREATE TYPE party_type_marker as enum
('from', 'to', 'cc', 'bcc');

-- Storage Marker defines the message will be stored in draft, inbox or sent
-- Example: A message which is currently not sent will be stored in a draft
CREATE TYPE storage_marker as enum
('draft', 'send', 'inbox', 'trash');

CREATE TABLE main.thread -- A single thread may contain multiple messages
(
id uuid NOT NULL DEFAULT uuid_generate_v1(),
subject text NOT NULL,
message_counts int4 NULL DEFAULT 1, -- These are the number of messages in a Single Thread
deleted boolean DEFAULT false, -- Soft Delete Feature
ext_id varchar,
ext_metadata jsonb,
created_by varchar,
modified_by varchar,
created_on timestamptz DEFAULT NOW(),
modified_on timestamptz,
CONSTRAINT thread_pkey PRIMARY KEY(id)
);

CREATE TABLE main.message
(
id uuid NOT NULL DEFAULT uuid_generate_v1(),
sender text NOT NULL,
subject text NOT NULL,
body text NOT NULL
status storage_marker NOT NULL DEFAULT 'draft'::storage_marker,
thread_id uuid NOT NULL REFERENCES thread(id),
deleted boolean DEFAULT false,
ext_id varchar,
ext_metadata jsonb,
created_by varchar,
modified_by varchar,
created_on timestamptz DEFAULT NOW(),
modified_on timestamptz,
CONSTRAINT message_pkey PRIMARY KEY(id)
);

CREATE TABLE main.attachment
(
id uuid NOT NULL DEFAULT uuid_generate_v1(),
"name" text NOT NULL,
"path" text NOT NULL,
thumbnail text NOT NULL,
mime text NOT NULL,
message_id uuid NOT NULL REFERENCES message(id),
deleted boolean DEFAULT false,
ext_id varchar,
ext_metadata jsonb,
created_by varchar,
modified_by varchar,
created_on timestamptz DEFAULT NOW(),
modified_on timestamptz,
CONSTRAINT attachment_pkey PRIMARY KEY (id)
);

CREATE TABLE main.group
(
id uuid NOT NULL DEFAULT uuid_generate_v1(),
party varchar NOT NULL,
"type" party_type_marker,
"storage" storage_marker DEFAULT 'inbox'::storage_marker,
visibility visibility_type DEFAULT 'new'::visibility_type,
message_id uuid NOT NULL REFERENCES message(id),
thread_id uuid NOT NULL REFERENCES thread(id),
deleted boolean,
ext_id varchar,
ext_metadata jsonb,
created_by varchar,
modified_by varchar,
created_on timestamptz DEFAULT NOW(),
modified_on timestamptz,
CONSTRAINT group_pkey PRIMARY KEY(id)
);

CREATE TABLE main.meta
(
id uuid NOT NULL DEFAULT uuid_generate_v1(),
"key" text NOT NULL,
value text NULL,
message_id uuid NOT NULL REFERENCES message(id),
deleted boolean,
ext_id varchar,
ext_metadata jsonb,
created_by varchar,
modified_by varchar,
created_on timestamptz DEFAULT NOW(),
modified_on timestamptz
);

create schema logs;
-- Table Audit Logs to store the logs for enteries in table created or modified
CREATE TABLE logs.audit_logs (
    id uuid DEFAULT uuid_generate_v1 () NOT NULL,
    action_by varchar,
    "after" jsonb,
    "before" jsonb,
    entity_id varchar,
    log_type varchar(100) DEFAULT 'APPLICATION_LOGS' ::character varying,
    operation_name varchar(10) NOT NULL,
    operation_time timestamptz DEFAULT now() NOT NULL,
    "table_name" varchar(60) NOT NULL,
    ext_id varchar,
    ext_metadata jsonb,
    CONSTRAINT pk_audit_logs_id PRIMARY KEY (id)
);

COMMENT ON TABLE logs.audit_logs IS 'DB trigger based audit_logs';

COMMENT ON COLUMN logs.audit_logs.action_by IS 'Person/User Email ID.';

CREATE OR REPLACE FUNCTION logs.audit_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
  DECLARE
    USER_ID VARCHAR;
    ENTITY_ID VARCHAR;
BEGIN
IF TG_OP = 'INSERT'
THEN
USER_ID := to_json(NEW)->'created_by';
ENTITY_ID := to_json(NEW)->'id';
INSERT INTO logs.audit_logs (
  operation_name,
  table_name,
  log_type,
  entity_id,
  action_by,
  after,
  ext_id,
  ext_metadata
  )
VALUES (
  TG_OP,
  TG_TABLE_NAME,
  TG_ARGV[0],
  ENTITY_ID,
  USER_ID,
  to_jsonb(NEW),
  to_json(NEW)->'ext_id',
  to_json(NEW)->'ext_metadata'
  );
RETURN NEW;
ELSIF TG_OP = 'UPDATE'
THEN
USER_ID := to_json(NEW)->'modified_by';
ENTITY_ID := to_json(NEW)->'id';
-- IF NEW != OLD THEN
 INSERT INTO logs.audit_logs (
   operation_name,
   table_name,
   log_type,
   entity_id,
   action_by,
   before,
   after,
   ext_id,
   ext_metadata
   )
VALUES (
  TG_OP,
  TG_TABLE_NAME,
  TG_ARGV[0],
  ENTITY_ID,
  USER_ID,
  to_jsonb(OLD),
  to_jsonb(NEW),
  to_json(NEW)->'ext_id',
  to_json(NEW)->'ext_metadata'
  );
-- END IF;
 RETURN NEW;
ELSIF TG_OP = 'DELETE'
THEN
USER_ID := to_json(OLD)->'modified_by';
ENTITY_ID := to_json(OLD)->'id';
INSERT INTO logs.audit_logs (
  operation_name,
  table_name,
  log_type,
  entity_id,
  action_by,
  before,
  ext_id,
  ext_metadata)
VALUES (
  TG_OP,
  TG_TABLE_NAME,
  TG_ARGV[0],
  ENTITY_ID,
  USER_ID,
  to_jsonb(OLD),
  to_json(OLD)->'ext_id',
  to_json(OLD)->'ext_metadata'
);
RETURN OLD;
END IF;
END;
$function$
;

CREATE TRIGGER attachment_audit_trigger
AFTER UPDATE OR INSERT OR DELETE
ON main.attachment
FOR EACH ROW
EXECUTE PROCEDURE logs.audit_trigger('attachment');

CREATE TRIGGER message_audit_trigger
AFTER UPDATE OR INSERT OR DELETE
ON main.message
FOR EACH ROW
EXECUTE PROCEDURE logs.audit_trigger('message');

CREATE TRIGGER meta_audit_trigger
AFTER UPDATE OR INSERT OR DELETE
ON main.meta
FOR EACH ROW
EXECUTE PROCEDURE logs.audit_trigger('meta');

CREATE TRIGGER group_audit_trigger
AFTER UPDATE OR INSERT OR DELETE
ON main.group
FOR EACH ROW
EXECUTE PROCEDURE logs.audit_trigger('group');

CREATE TRIGGER thread_audit_trigger
AFTER UPDATE OR INSERT OR DELETE
ON main.thread
FOR EACH ROW
EXECUTE PROCEDURE logs.audit_trigger('thread');
```

### Implementation

Create a new Application using Loopback Cli and add the Component for Inmail Service in application.ts

```typescript
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import { InMailServiceComponent } from '@sourceloop/inmail-service';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import path from 'path';

export {ApplicationConfig};

const port = 3000;
export class Client extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: true,
      includeProcessEnv: true,
    });
    options.rest = options.rest || {};
    options.rest.port = +(process.env.PORT || port);
    options.rest.host = process.env.HOST;
    super(options);
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    // add Component for InMailService
    this.component(InMailServiceComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
```
### Setting Environment Variables

Do not forget to set Environment variables
```environment
NODE_ENV=
LOG_LEVEL=
HOST=
PORT=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
DB_SCHEMA=
JWT_SECRET=
JWT_ISSUER=
```

### Setting up Datasource

Here is a Sample Implementation datasource Implemention using environment Variables
```TypeScript
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'inmailDb',
  connector: 'postgresql',
  url: '',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};

@lifeCycleObserver('datasource')
export class VideochatDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'inmail';
  static readonly defaultConfig = config;
  
  constructor(
    // You need to set datasource configuration name as 'datasources.config.inmail' otherwise you might get Errors
    @inject('datasources.config.inmail', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```

### API Documentation

#### Common Headers

Authorization: Bearer <token> where <token> is a JWT token signed using JWT issuer and secret.
Content-Type: application/json in the response and in request if the API method is NOT GET

#### Common Request path Parameters

{version}: Defines the API Version

### Common Responses

200: Successful Response. Response body varies w.r.t API<br/>
401: Unauthorized: The JWT token is missing or invalid<br/>
403: Forbidden : Not allowed to execute the concerned API<br />
404: Entity Not Found<br />
400: Bad Request (Error message varies w.r.t API)<br />
201: No content: Empty Response<br />

#### API Details

##### POST /originator/{version}/mails

**Description:** Compose or draft a Mail to various Recipients

**Request Body:**
```javascript
{
  "threadId": "string", // Optional, add if you want the messages in a same thread
  "groups": [ // You can define one or more receipients in a group array.
    {
      "party": "string", // email of the recipient
      "type": "to", // type can be to | cc | bcc
    }
  ],
  "attachments": [ // Optional
    { 
      "name": "string", // name of the attachment file
      "path": "string", // It can be url like s3 url
      "thumbnail": "string", // Smaller/Compressed version of attachment path. can be s3 url
      "mime": "string", // Content Type of a file (example: image/jpg)
    }
  ],
  "meta": [ // Optional
    {
      "key": "string", // Key Name like Content-Type
      "value": "string", // Value like application/json, text/html etc.
    }
  ],
  "body": "string", // The Message Body
  "subject": "string", // The title  of the Message
  "status": "string", // Draft if you don't want to send message Now
  "extId": "string", // External Id from the Client (Optional)
  "extMetadata": {} // External Metadata from the Client (Optional)
}
```
**Successful Response:**
```javascript
{
  "id": "string", // id of the message
  "version": "string" // API vewrsion
}
```
##### PUT /originator/{version}/mails/{messageId}

**Description:** Update Drafted Messages such as modifying attachment, receipients, message body, subject etc.

**Request path Parameters:**

{messageId}: Unique Id of the message which needs to be updated

**Request Body:**
```javascript
{
  "groups": [ // You can define one or more receipients in a group array.
    {
      "party": "string", // email of the recipient
      "type": "to", // type can be to | cc | bcc
    }
  ],
  "attachments": [ // Optional
    { 
      "name": "string", // name of the attachment file
      "path": "string", // It can be url like s3 url
      "thumbnail": "string", // Smaller/Compressed version of attachment path. can be s3 url
      "mime": "string", // Content Type of a file (example: image/jpg)
    }
  ],
  "meta": [ // Optional
    {
      "key": "string", // Key Name like Content-Type
      "value": "string", // Value like application/json, text/html etc.
    }
  ],
  "body": "string", // The Message Body (Optional)
  "subject": "string", // The title  of the Message (Optional)
  "status": "string", // Draft if you don't want to send message Now, otherwise, send
  "extId": "string", // External Id from the Client (Optional)
  "extMetadata": "object" // External Metadata from the Client (Optional)
}
```
Success Response:
```javascript
{
  "id": "string", // id of the message
  "version": "string" // API vewrsion
}
```

##### POST /originator/{version}/mails/{messageId}/attachments

**Description:** add an attachment to an existing drafted mail

**Request path Parameters:**

{messageId}: The unique id of a mail

**Request Body:**
```javascript
{
  "attachments": [
    {
      "name": "string", // name of the attachment file
      "path": "string", // It can be url like s3 url
      "thumbnail": "string", // Smaller/Compressed version of attachment path. can be s3 url
      "mime": "string" // Content Type of a file (example: image/jpg)
    }
  ]
}
```

**Successful Response:**
```javascript
{
  "items": "array", // array containing attachments,
  "version": "string", // an API version
}
```
##### DELETE /originator/{version}/mails/{messageId}/{storage}/{action}

**Description:** Move inbox/sent items to trash or delete the trashed item

**Request path Parameters:**

{storage}: inbox/send/trash (to trash the inbox/sent message or to delete the trashed message)

{action}: trash/delete

**Successful Response:**
```javascript 
{ 
  "version" : "string", // the API version
  "item": "object" // recipient/sender details which was marked for deletion/trash
}
```

##### PATCH /originator/{version}/mails/{messageId}/restore

**Description:** Restore the trashed Mail

**Request path Parameter:**

{messageId}: Unique message Id

**Successful Response:**
```javascript
{
  "version": "string", // the API version
  "item": "object" // receipient/sender details which was restored from trash
}
```

##### PATCH /originator/{version}/mails/{messageId}/forward 

**Description:** Forward the mail to another receipient

**Request path Parameter:**

{messageId}: Unique message Id

**Request Body:**
```javascript
{
  "groups": [ // you can specify more recipients in groups array for forwarding the mail to multiple recipients
    {
      "party": "string", // email of the recipient
      "type": "to" | "bcc" | "cc", // receipient type
    }
  ]
}
```
**Successful Response:**
```javascript
{
  "version": "string", // the API version
  "id": "string" // the message Id
}
```

##### PATCH /originator/{version}/mails/{messageId}/send

**Description:** Send the drafted mail to the receipent

**Request path Parameter:**

{messageId}: Unique Message Id

Successful response
```javascript
{
  "id": "string",
  "version": "string"
}
```


##### GET /collector/{version}/threads/{threadId}

**Request path Parameters:**

{threadId}: Unique id of thread

**Request query Parameter(Optional):**

filter: Object which contains attribute(s) key value pairs of thread model which is used to filter data.

**Successful Response:**
```javascript
{
  "version": "string", // the API version
  "item": "object" // item containg the thread and the related message, attachment and/or meta-data details
}
```

##### GET /collector/{version}/threads/{offset}/{limit}

**Request path Parameters:**

{offset}: the starting index of the items which needs to be fetched.

For example In a database of 10 threads, an offest of 5 will fetch item from the 6th index
{limit}: limits the number of items to be fetched

**Request query parameter:**

filter: Object which contains attribute(s) key value pairs of thread model which is used to filter items.

**Successful Response:**
```javascript 
{
   "version": "string", // the API version
   "items": "array"  // array containing thread details and the corresponding messages, attachments etc.
}
```

##### GET /collector/{version}/mails/{offset}/{limit}/{type}

**Request path Parameters:**

{offset}: the starting index of the items which needs to be fetched.

For example In a database of 10 threads, an offest of 5 will fetch item from the 6th index

{limit}: limits the number of items to be fetched

{type} : any one of inbox/send/trash/draft  

**Request query parameter:**

filter: Object which contains attribute(s) key value pairs of message model which is used to filter items.


##### GET /collector/{version}/mails/{messageId}/meta-data

**Description:** fetch metadata related to a mail 

**Request path parameter:**

{messageId}: unique messageId

**Request query parameter:**

filter: Object which contains attribute(s) key value pairs of message model which is used to filter items.

**Successful Response:**
```javascript
{
  "id": "string", // the API version
  "items": "array" // array containing meta data related to a particular message
}
```

##### GET /collector/{version}/mails/{messageId}/attachments

**Description:** fetch attachments related to a particular mail

**Request path parameter:**

{messageId}: unique messageId

**Request query parameter:**

filter: Object which contains attribute(s) key value pairs of attachment model which is used to filter items.

**Successful Response:**
```javascript
{
  "version": "string", // the API version
  "items": "array" // array containing attachments   
}
```
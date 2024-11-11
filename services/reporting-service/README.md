# reporting-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/reporting-service)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/reporting-service)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/reporting-service/@loopback/core)

### Introduction

### Reporting Service Component

The Reporting Service Component, part of the ARC microservices suite, is a versatile and robust solution designed for data ingestion, processing, and reporting.This component serves two primary functions:

#### 1. Data Ingestion and Processing

The component excels in accepting diverse data objects and storing them in various data stores such as relational databases (PostgreSQL, MySQL, etc.) and cloud storage solutions like Amazon S3. At the core of its functionality are the ingestionMappings, which create a dynamic bridge between the recordType of incoming data and the corresponding storage tables or locations. These mappings facilitate the tailored processing of data based on its recordType.

During initialization, the component retrieves the list of ingestion mappings from its data store, setting the stage for data processing. It then determines whether a custom listener for a specific recordType exists. If found, the custom listener takes charge of processing data objects of that type; otherwise, the responsibility falls to the component's default listener. Additionally, the component scans for custom listeners for data type conversion, enabling specialized processing and transformation of data properties as needed. The component also comes equipped with pre-written converters and optional mapping objects to further refine data handling.

The Reporting Service Component also features mechanisms to exclude certain property data from being processed and to trace the state of data objects, providing insights into processing stages like pending, processed, or failed, with error tracking for the latter.

#### 2. Reporting and Data Analysis

Central to the reporting functionality is the concept of data sources and datasets. Data sources can range from database tables to files in an S3 bucket. Users can query these data sources using a StructuredQueryInterface, which supports a comprehensive set of SQL-like operations, including various functions, joins, and conditional statements.

The component allows users to create datasets based on complex JSON queries. These datasets can be used to retrieve data with sorting and pagination options. Unique to this component is the ability to prevent duplicate datasets through hash-based duplication checks, where users can specify which columns or properties should be used for hash generation.

Furthermore, the Reporting Service Component supports logical CRUD operations for widgets and dashboards. Users can create multiple widgets, assemble them into dashboards, and manage these dashboards effectively.

This README provides a detailed guide on how to integrate and utilize the Reporting Service Component in your ARC microservices environment, ensuring you can leverage its full potential for data ingestion, processing, and insightful reporting.

## Installation

### Step 1: Install the Package

To use the Reporting Service Component in your LoopBack 4 application, start by installing the package:

```typescript
npm i @sourceloop/reporting-service
```

### Step 2: Bind the DataSource

Bind the ReportingCoreDataSource to your application to enable the component to access its core tables:

this.bind('datasources.ReportingCore').toClass(ReportingCoreDataSource);

This binding is crucial for the component to function properly as it connects to the data store that the component uses for its operations.

### Step 3: Configure Data Store

Next, set up the configuration for your data store. The following example assumes that you are using PostgreSQL as your database:

```typescript
import {ReportingServiceComponentBindings} from '@sourceloop/reporting-service';

this.bind(ReportingServiceComponentBindings.DATA_STORE_CONFIGURATION).to({
  type: DbName.POSTGRES,
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'telescope',
  databaseType: DbName.POSTGRES,
});
```

DataStoreConfiguration supports both SequelizeDataStoreConfiguration and S3DataStoreConfiguration types.

### Step 4: Optional DataType Mapping

Optionally, you can bind PostgresDataTypes to provide a mapping for property data types:

```typescript
import {PostgresDataTypes} from 'path-to-postgres-data-types';

this.bind(ReportingServiceComponentBindings.DATA_TYPE_MAP).to(
  PostgresDataTypes,
);
```

The PostgresDataTypes mapping facilitates the conversion of column data types from the DataStore to the appropriate format for API responses and ingestion processing. It defines how each PostgreSQL data type should be converted to a response data type, JSON value type, and provides optional default conversion functions.

### Example of DataType Mapping:

```typescript
export class PostgresDataTypes {
  constructor(
    @inject(
      ReportingServiceComponentBindings.GENERIC_DATA_TYPE_CONVERSION_FUNCTIONS,
    )
    private conversionUtils: DataStoreDataTypeConversionFunctions,
  ) {}
  value(): Record<string, DataTypeMapping> {
    return {
      varchar: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      text: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      //other datatypes as needed
    };
  }
}
```

This mapping specifies:

- The data type for each PostgreSQL data type (dataType).
- The expected JSON value type for ingestion (jsonValueType).
- An optional default conversion function (convertDefaultFunc).

#### Data Type Conversion Functions:

The Data Type Providers can be given a set of default functions which can be used for conversion, it has to be injected into the dataType there is a default created in the component which may be reused. By following DataStoreDataTypeConversionFunctions interface, end user can cretate & pass there own function set.
Following is the example of an datatype conversion function implementation.

```typescript
export class GenericConversionUtils
  implements DataStoreDataTypeConversionFunctions
{
  convertToString(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): string {
    this.checkNullAndMandatory(value, options);
    if (value === null) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return value.toString();
  }
  //other function as per interface
}
```

once created the end user may pass it to component as

```typescript
this.application
  .bind(
    ReportingServiceComponentBindings.GENERIC_DATA_TYPE_CONVERSION_FUNCTIONS,
  )
  .toClass(GenericConversionUtils);
```

### Step 5: Bind Datastore Adapter

#### Bind the Data Store Adapter

```typescript
import {PsqlSequelizeStrategy} from 'path-to-psql-sequelize-strategy';

this.bind(ReportingServiceComponentBindings.DATA_STORE_ADAPTER).toClass(
  PsqlSequelizeStrategy,
);
```

This binding is essential for the component to interface with the data store, whether it's a database or a cloud storage solution.

### Configure Dataset Duplication Check

To enable duplication checks for datasets and specify which keys should be used for hashing, bind the configuration like this:

```typescript
this.bind(ReportingServiceComponentBindings.DATA_SET_CONFIG).to({
  hashFields: ['name', 'otherKey'], // Add other keys as needed from data set model
});
```

### Step 6: Bind the Component

Finally, bind the Reporting Service Component to your application:

```typescript
import {ReportingServiceComponent} from '@sourceloop/reporting-service';

this.component(ReportingServiceComponent);
```

### Optionally pass validation for SQL Queries

For use cases requiring direct SQL queries, the component now offers support for plain SQL. It's important to note that when using direct SQL, the responsibility for query validation shifts to the component user. To assist with SQL validation, the component can be configured with a custom SqlValidatorInterface implementation:

```typescript
export interface SqlValidatorInterface {
  validate(sqlQuery: string): Promise<boolean>;
}
```

This interface ensures that your SQL queries are validated according to your custom logic, enhancing the security and reliability of direct SQL query usage within the component.
To utilize the SqlValidatorInterface, you need to implement your own SQL validation logic and bind it to your application. This can be done as follows:

```typescript
import {SqlValidatorInterface} from '@sourceloop/reporting-service';

class MyCustomSqlValidator implements SqlValidatorInterface {
  async validate(sqlQuery: string): Promise<boolean> {
    // Implement your SQL validation logic here
    return true; // return true if the SQL query is valid
  }
}

// In your application constructor
this.bind(ReportingServiceComponentBindings.SQL_VALIDATOR).toClass(
  MyCustomSqlValidator,
);
```

This completes the setup, and your application is now equipped to utilize the features of the Reporting Service Component for data ingestion, processing, and reporting.

## Features Overview

The Reporting Service Component offers a comprehensive suite of features designed to cater to a wide range of data ingestion, processing, and reporting needs. Below is an overview of its key features:

### 1. Dynamic Data Ingestion

- Versatile Data Storage: Capable of ingesting and storing data in various data stores, including relational databases (like PostgreSQL, MySQL) and cloud storage solutions (e.g., Amazon S3).
- Ingestion Mappings: Utilizes ingestionMappings to dynamically link the recordType of incoming data to the corresponding storage tables or locations.
- Custom Listeners: Supports custom listeners for specific recordType, enabling tailored processing of data objects.
- Data Type Conversion: Facilitates custom data type conversion, allowing specialized processing and transformation of data properties.

### 2. Advanced Reporting Capabilities

- Data Sources and Datasets: Enables users to query data sources (ranging from database tables to S3 bucket files) using a comprehensive StructuredQueryInterface.
- JSON Query Support: Allows creation of complex datasets based on JSON queries, supporting operations like sorting and pagination.
- Duplication Prevention: Features unique hash-based checks to prevent duplicate datasets, with user-defined columns or properties for hash generation.
- Customizable Widgets and Dashboards: Supports logical CRUD operations for widgets and dashboards, allowing users to create and manage multiple widgets and dashboards.

### 3. State Tracking and Error Handling

- Processing State Traceability: Offers mechanisms to trace the state of data objects through processing stages (pending, processed, failed), including error tracking for failed states.
- State Tracing Controller: Enables checking the processing state of data objects through a dedicated state tracing controller.

### 4. Flexible Configuration and Customization

- Customizable Data Store Configuration: Supports configurations for different types of data stores, including relational databases and cloud storage.
- DataType Mapping: Provides optional bindings for data type mappings, facilitating the conversion of column data types for API responses and ingestion processing.
- Extendable Type Converters: Includes pre-written converters and mapping objects, with the option to extend or customize based on specific requirements.

### 5. Streamlined Data Processing Workflow

- Initializer Functionality: During initialization, the component fetches ingestion mappings, checks for custom listeners, and sets up data type converters.
- Automated Data Processing: Post-initialization, the component processes incoming IngestReportRecord objects, handling them via default or custom listeners based on their recordType.

The Reporting Service Component is designed to be a versatile and robust solution for organizations seeking efficient and customizable data management and reporting capabilities. Its modular architecture and extensive feature set make it suitable for a wide range of applications and use cases.

## Detailed Guides

### Bindings

In the Reporting Service Component, bindings play a crucial role in integrating and configuring various functionalities. This section outlines the key bindings used and their purposes.

#### 1. DataSource Binding

- Purpose: Connects the component to the ReportingCoreDataSource, essential for the component's interaction with its core data store.

#### 2. Data Store Configuration Binding

- Purpose: Configures the data store (e.g., PostgreSQL, cloud storage) used by the component. This binding defines critical parameters like host, port, username, and database details.

#### 3. DataType Mapping Binding (Optional)

- Purpose: Provides a mapping for data type conversions, particularly useful when dealing with different PostgreSQL data types. It defines how data types are converted for API responses and during ingestion processing.

#### 4. Data Store Adapter Binding

- Purpose: The DataStoreAdapter serves as a crucial interface between the component and the data store. It abstracts the data store operations, allowing the component to interact with different types of data stores (e.g., relational databases, S3 buckets) seamlessly.
- Significance: This binding enables the component to perform a variety of data store operations, such as listing data sources, querying data, managing records, and applying filters. It's central to the component's ability to handle data dynamically and efficiently.

#### 5. Data Store Object Provider Binding

- Purpose: The DataStoreObjectProvider provides a data store object based on the configuration. It supports both SequelizeDataStoreConfiguration for relational databases and S3DataStoreConfiguration for AWS S3 storage.
- Significance: This provider abstracts the creation of the data store object (either a Sequelize instance for databases or an AWS.S3 instance for cloud storage), based on the provided configuration. It ensures that the correct data store instance is instantiated and made available to the DataStoreAdapter.

#### 6. Component Binding

- Purpose: Integrates the Reporting Service Component into the application. This binding is essential to activate and utilize the component's features.

Each of these bindings contributes to the flexibility and functionality of the Reporting Service Component, ensuring it can be tailored to meet diverse data storage and processing needs.

### Decorators

Decorators in the Reporting Service Component provide a way to add metadata to classes, enhancing their capabilities and defining their roles within the component. Here are two key decorators:

#### 1. Record Type Handler Decorator

- Decorator: handleRecordType
- Purpose: This decorator associates a class with a specific recordType. It is particularly useful for creating event listeners that are triggered for specific types of records in the reporting process.
- Usage:

```typescript
import {handleRecordType} from 'path-to-decorators';

@handleRecordType('exampleRecordType')
export class ExampleRecordTypeHandler {
  // Implementation of the handler
}
```

Here, ExampleRecordTypeHandler is designated as the handler for events associated with exampleRecordType.

#### 2. Custom Type Converter Decorator

- Decorator: CustomTypeConversion
- Purpose: This decorator is used to define a custom type converter. By specifying a convertType, it marks a class as a handler for converting that specific type.
- Usage:

```typescript
import {CustomTypeConversion} from 'path-to-decorators';

@CustomTypeConversion('convertTypeExample')
export class CustomTypeConverter {
  // Implementation of the converter
}
```

In this example, CustomTypeConverter is marked as a handler for converting the specified convertTypeExample.

These decorators play a crucial role in the configuration and functionality of the Reporting Service Component, enabling a modular and extendable architecture. They allow for the easy association of classes with specific processing roles and data types, thereby enhancing the component's ability to manage and process data dynamically.

### **Flexible Data Ingestion Integration**

The Reporting Service Component is designed to be adaptable, capable of handling data ingestion from a wide range of sources. While the component itself does not impose any specific data ingestion mechanism, it can be seamlessly integrated with various external data sources, such as Kafka, AWS SQS, or other messaging systems. Below is an example of how to integrate the component with Kafka, demonstrating its adaptability.

#### **Example: Kafka Integration with Report Kafka Consumer Service**

The ReportKafkaConsumerService class exemplifies integrating the Reporting Service Component with a Kafka consumer. This is just one example of how the component can be adapted to work with different data sources.

##### **Overview:**

- **Purpose:** The service subscribes to a Kafka topic (e.g., reporting-core) and processes incoming messages related to reporting data.
- **Process:** It utilizes the ReportIngestionMessagingService to handle the IngestReportRecord payload from Kafka messages.

```typescript
@injectable(asConsumer)
export class ReportKafkaConsumerService
  implements IGenericConsumer<IStreamDefinition>
{
  // Kafka topic subscription

  topic: string = 'reporting-core';

  constructor(@inject.context() private context: Context) {}

  // Message handler

  async handler(payload: IngestReportRecord) {
    const reportIngestionMessagingService: ReportIngestionMessagingService =
      this.context.getSync('services.ReportIngestionMessagingService');

    reportIngestionMessagingService.processMessage(payload);
  }
}
```

##### **Integration Steps:**

1. **Configure the Kafka client** and ensure it is set up in your application.
1. **Instantiate the ReportKafkaConsumerService**, configuring it to listen to the desired Kafka topic.

#### **Adapting to Other Data Sources**

While this example uses Kafka, the Reporting Service Component can be integrated with other data sources such as AWS SQS, RabbitMQ, or custom HTTP webhooks. The key is to implement a service similar to ReportKafkaConsumerService that can receive and process messages or data payloads according to the requirements of the chosen data source.

### **Flexibility and Extensibility**

This example highlights the Reporting Service Component's flexibility in handling data ingestion. It can be extended and adapted to various data sources, making it a versatile choice for different architectural needs.

### Migrations

The migrations required for this service are processed during the installation automatically if you set the `REPORTS_MIGRATION` or `SOURCELOOP_MIGRATION` env variable. The migrations use [`db-migrate`](https://www.npmjs.com/package/db-migrate) with [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) driver for migrations, so you will have to install these packages to use auto-migration. Please note that if you are using some pre-existing migrations or databasea, they may be affected. In such a scenario, it is advised that you copy the migration files in your project root, using the `REPORTS_MIGRATION_COPY` or `SOURCELOOP_MIGRATION_COPY` env variables. You can customize or cherry-pick the migrations in the copied files according to your specific requirements and then apply them to the DB.

### API Documentation

#### Common Headers

Authorization: Bearer <token> where <token> is a JWT token signed using JWT issuer and secret.
`Content-Type: application/json` in the response and in request if the API method is NOT GET

#### Common Request path Parameters

{version}: Defines the API Version

### Common Responses

200: Successful Response. Response body varies w.r.t API
401: Unauthorized: The JWT token is missing or invalid
403: Forbidden : Not allowed to execute the concerned API
404: Entity Not Found
400: Bad Request (Error message varies w.r.t API)
201: No content: Empty Response

## API Details

Visit the [OpenAPI spec docs](./openapi.md)

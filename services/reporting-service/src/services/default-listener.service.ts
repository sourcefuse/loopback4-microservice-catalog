import {BindingScope, inject, injectable} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import {IngestReportRecord} from '../interfaces';
import {DataStoreAdapter} from '../interfaces/data-store-adapter.interface';
import {IngestionMapping} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
/* The `DefaultListenerService` class is responsible for processing incoming payloads, updating the
database, and logging any errors that occur during the process. */
export class DefaultListenerService {
  constructor(@inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger) {
    this.logger.info('Default Listener Service is up and running');
  }

  /**
   * The function processes a message by updating data in a database and logging any errors that occur.
   * @param {DataStoreAdapter} dbo - The `dbo` parameter is an instance of the `DataStoreAdapter`
   * class, which is used to interact with the database. It provides methods for managing records, such
   * as inserting, updating, and deleting data.
   * @param {IngestReportRecord} payload - The `payload` parameter is an object that contains the data
   * to be processed. It has the following properties:
   * @param {IngestionMapping} ingestionMappingContext - The `ingestionMappingContext` parameter is an
   * object that contains information about the mapping between the incoming data and the database
   * schema. It includes the following properties:
   */
  async processMessage(
    dbo: DataStoreAdapter,
    payload: IngestReportRecord,
    ingestionMappingContext: IngestionMapping,
  ): Promise<void> {
    this.logger.info(
      `Payload Received by Default listener for  ${payload.recordType}  id is", ${payload.recordId}`,
    );
    try {
      //first update the data in the database
      if (payload.cdc?.currentValue) {
        this.logger.info(
          `Upserting record for from default listener ${payload.recordType}`,
        );
        await dbo.manageRecord(
          ingestionMappingContext.dataSourceName,
          payload,
          ingestionMappingContext.primaryColumn,
        );
      }
      // to be done write code for the permission object
    } catch (error) {
      this.logger.error(
        `An error occurred while processing the message in default listerner: ${JSON.stringify(
          error,
        )}`,
      );
      throw error; // Re-throw the error so it can be caught by calling function
    }
  }
}

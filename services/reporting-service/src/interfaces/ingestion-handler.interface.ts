import {IngestionMapping} from '../models/ingestion-mapping.model';
import {DataStoreAdapter} from './data-store-adapter.interface';
import {IngestReportRecord} from './ingest-report-record.interface';

export interface IngestionHandler {
  processMessage: (
    DBO: DataStoreAdapter,
    payload: IngestReportRecord,
    ingestionMappingContext: IngestionMapping,
  ) => Promise<void>;
}

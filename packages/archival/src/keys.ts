import {S3ClientConfig} from '@aws-sdk/client-s3';
import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {ArchivalComponent} from './component';
import {
  ExportDataExternalSystem,
  ImportDataExternalSystem,
  ProcessRetrievedData,
} from './types';

/**
 * Binding keys used by this component.
 */
export namespace ArchivalComponentBindings {
  export const COMPONENT = BindingKey.create<ArchivalComponent>(
    `${BINDING_PREFIX}.ArchivalComponent`,
  );

  export const EXPORT_ARCHIVE_DATA =
    BindingKey.create<ExportDataExternalSystem | null>(
      `${BINDING_PREFIX}.entity.archive.export`,
    );

  export const IMPORT_ARCHIVE_DATA =
    BindingKey.create<ImportDataExternalSystem | null>(
      `${BINDING_PREFIX}.entity.archive.import`,
    );

  export const PROCESS_RETRIEVED_DATA =
    BindingKey.create<ProcessRetrievedData | null>(
      `${BINDING_PREFIX}.entity.import`,
    );
}

export namespace AWSS3Bindings {
  export const Config = BindingKey.create<AwsS3Config>(
    `${BINDING_PREFIX}.archival.s3.config`,
  );
}

export interface AwsS3Config extends S3ClientConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
}

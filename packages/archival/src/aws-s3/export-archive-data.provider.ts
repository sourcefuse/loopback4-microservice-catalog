import {PutObjectCommand, S3} from '@aws-sdk/client-s3';
import {BindingScope, Provider, inject, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AWSS3Bindings, AwsS3Config} from '../keys';
import {ExportDataExternalSystem} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ExportArchiveDataProvider
  implements Provider<ExportDataExternalSystem>
{
  constructor(
    @inject(AWSS3Bindings.Config, {optional: true})
    private readonly config: AwsS3Config,
  ) {}
  value(): ExportDataExternalSystem {
    return async (seletedEntries: AnyObject[]) =>
      this.exportToCsv(seletedEntries);
  }
  async exportToCsv(seletedEntries: AnyObject[]): Promise<string> {
    const csvRows = [];
    const header = Object.keys(seletedEntries[0]);

    csvRows.push(header.join(','));

    for (const entry of seletedEntries) {
      const values = [];

      for (const key of header) {
        let value = entry[key];

        // Check if it is an object
        // convert object to string

        if (value instanceof Date) {
          value = new Date(value).toISOString();
        } else if (value && typeof value === 'object') {
          value = JSON.stringify(entry[key]);
          // Escape existing quotation marks within the value
          value = value.replace(/"/g, '""');
          // Surround the value with quotation marks
          value = `"${value}"`;
        } else {
          //this is intentional
        }

        values.push(value);
      }
      csvRows.push(values.join(','));
    }
    const csvString = csvRows.join('\n');
    const timestamp = new Date().toISOString();
    //Example: PATH_TO_UPLOAD_FILES='/path'
    const fileName = `${process.env.PATH_TO_UPLOAD_FILES}/archive_${timestamp}.csv`;

    const s3Config: AwsS3Config = {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? this.config.accessKeyId,
        secretAccessKey:
          process.env.AWS_SECRET_ACCESS_KEY ?? this.config.secretAccessKey,
      },
      region: process.env.AWS_REGION ?? this.config.region,
      ...this?.config,
      // Other properties...
    };
    const s3Client: S3 = new S3(s3Config);
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const params = {
      Body: csvString,
      Key: fileName,
      Bucket: bucketName as string,
    };
    try {
      await s3Client.send(new PutObjectCommand(params));
      return params.Key;
    } catch (error) {
      throw new HttpErrors.UnprocessableEntity(error.message);
    }
  }
}

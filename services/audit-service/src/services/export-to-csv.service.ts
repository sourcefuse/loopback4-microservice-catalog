import {PutObjectCommand, S3} from '@aws-sdk/client-s3';
import {BindingScope, Provider, inject, injectable} from '@loopback/core';
import {EntityCrudRepository, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AWSS3Bindings, AwsS3Config} from '../keys';
import {AuditLog} from '../models';
import {AuditLogRepository} from '../repositories';
import {ExportToCsvFn} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ExportToCsvProvider implements Provider<ExportToCsvFn> {
  constructor(
    @inject(AWSS3Bindings.Config, {optional: true})
    private readonly config: AwsS3Config,
    @repository(AuditLogRepository)
    public auditLogRepository: EntityCrudRepository<AuditLog, string, {}>,
  ) {}
  value(): ExportToCsvFn {
    return async (selectedAuditLogs: AuditLog[]) =>
      this.exportToCsv(selectedAuditLogs);
  }
  async exportToCsv(selectedAuditLogs: AuditLog[]): Promise<string> {
    const csvRows = [];
    const header = Object.keys(selectedAuditLogs[0]);

    csvRows.push(header.join(','));

    for (const auditLog of selectedAuditLogs) {
      const values = [];

      for (const key of header) {
        let value = auditLog[key];

        // Check if the value is the "after" object
        if (key === 'after' || key === 'before') {
          value = JSON.stringify(auditLog[key]);

          // Escape existing quotation marks within the value
          value = value.replace(/"/g, '""');

          // Surround the value with quotation marks
          value = `"${value}"`;
        } else if (key === 'actedAt') {
          value = new Date(value).toISOString();
        } else {
          //this is intentional
        }

        values.push(value);
      }

      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const timestamp = new Date().toISOString();
    //Example: PATH_TO_UPLOAD_FILES='/uploads'
    const fileName = `${process.env?.PATH_TO_UPLOAD_FILES}/audit_logs_${timestamp}.csv`;

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

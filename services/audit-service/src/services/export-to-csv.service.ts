import {injectable, BindingScope, Provider, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AuditLog, AuditLogRepository} from '@sourceloop/audit-log';
import AWS from 'aws-sdk';
import {ExportToCsvFn} from '../types';
import {HttpErrors} from '@loopback/rest';
import {AWSS3Bindings, AwsS3Config} from '../keys';

@injectable({scope: BindingScope.TRANSIENT})
export class ExportToCsvProvider implements Provider<ExportToCsvFn> {
  constructor(
    @repository(AuditLogRepository)
    public auditLogRepository: AuditLogRepository,
    @inject(AWSS3Bindings.Config)
    private readonly config: AwsS3Config,
  ) {}
  value(): ExportToCsvFn {
    return async (selectedAuditLogs: AuditLog[]) => {
      return this.exportToCsv(selectedAuditLogs);
    };
  }
  async exportToCsv(
    selectedAuditLogs: AuditLog[],
  ): Promise<AWS.S3.ManagedUpload.SendData> {
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
    const fileName = `audit_logs_${timestamp}.csv`;

    AWS.config = new AWS.Config({
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
      region: this.config.region,
      ...this.config,
    });

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    try {
      const uploaderResponse = await new AWS.S3.ManagedUpload({
        params: {
          Body: csvString,
          Key: fileName,
          Bucket: bucketName as string,
        },
      }).promise();

      return uploaderResponse;
    } catch (error) {
      throw new HttpErrors.UnprocessableEntity(error.message);
    }
  }
}

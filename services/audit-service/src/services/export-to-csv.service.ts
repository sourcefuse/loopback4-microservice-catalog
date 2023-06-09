import {injectable, BindingScope, Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AuditLog, AuditLogRepository} from '@sourceloop/audit-log';
import AWS from 'aws-sdk';
import {ExportToCsvFn} from '../types';
import {HttpErrors} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class ExportToCsvProvider implements Provider<ExportToCsvFn> {
  constructor(
    @repository(AuditLogRepository)
    public auditLogRepository: AuditLogRepository,
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
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
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

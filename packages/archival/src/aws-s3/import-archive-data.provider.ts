import {
  BindingScope,
  injectable,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import AWS from 'aws-sdk';
import {ImportDataExternalSystem} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ImportArchiveDataProvider
  implements Provider<ImportDataExternalSystem>
{
  value(): ValueOrPromise<ImportDataExternalSystem> {
    return async (fileName: string) => this.getFileContent(fileName);
  }

  async getFileContent(fileName: string): Promise<AnyObject[]> {
    const stream = require('stream');
    const csv = require('csv-parser');

    AWS.config = new AWS.Config({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    const s3 = new AWS.S3();

    const params: AWS.S3.GetObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: fileName,
    };
    let s3Response;
    try {
      s3Response = await s3.getObject(params).promise();
      const csvData = s3Response.Body!.toString('utf-8');

      const jsonArray: AnyObject[] = await new Promise((resolve, reject) => {
        const results: AnyObject[] = [];
        stream.Readable.from(csvData)
          .pipe(csv())
          .on('data', (data: AnyObject) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', reject);
      });
      const headers = Object.keys(jsonArray[0]);
      for (const entry of jsonArray) {
        for (const key of headers) {
          const value = entry[key];
          entry[key] = this.processEntryValue(key, value);
        }
      }
      return jsonArray;
    } catch (error) {
      throw new HttpErrors.UnprocessableEntity(error.message);
    }
  }

  private processEntryValue(key: string, value: string) {
    if (value === '') {
      return null;
    }
    if (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)
    ) {
      return new Date(value);
    }
    return value;
  }
}

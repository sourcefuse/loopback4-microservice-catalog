import {
  BindingScope,
  CoreBindings,
  Provider,
  inject,
  injectable,
} from '@loopback/core';
import {Filter, defineCrudRepositoryClass, juggler} from '@loopback/repository';

import AWS from 'aws-sdk';
import csvtojson from 'csvtojson';
import {AuditServiceApplication} from '../application';
import {AuditLog} from '../models';
import {QuerySelectedFilesFn} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class QuerySelectedFilesProvider
  implements Provider<QuerySelectedFilesFn>
{
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: AuditServiceApplication,
  ) {}

  value(): QuerySelectedFilesFn {
    return async (fileName: string, filter: Filter<AuditLog>) =>
      this.querySelectedFiles(fileName, filter);
  }

  async querySelectedFiles(fileName: string, filter: Filter<AuditLog>) {
    const json = await this.getFileContent(fileName);
    /*Creating an in-memory datasource and a dynamic repository is also created
     through which data will be pushed in the in-memory db .Now the find operation
     will happen on that db only. This is to ensure simultanoeus find operation 
     across multiple users
     */
    const dsName = 'csvds';
    const csvDataSource = new juggler.DataSource({
      name: dsName,
      connector: 'memory',
    });
    await csvDataSource.connect();
    this.application.dataSource(csvDataSource, dsName);

    // configure repository
    const CSVRepo = defineCrudRepositoryClass<
      AuditLog,
      typeof AuditLog.prototype.id,
      {}
    >(AuditLog);
    Object.defineProperty(CSVRepo, 'name', {value: 'CsvRepo'});
    inject(`datasources.${csvDataSource.name}`)(CSVRepo, undefined, 0);
    this.application.repository(CSVRepo);

    const csvRepoInstance = await this.application.getRepository(CSVRepo);
    // Fill in the json returned from the csv
    if (!json) {
      throw new Error('No data to create');
    }
    await csvRepoInstance.createAll(json);

    const allRecords = await csvRepoInstance.find(filter);

    // clear up the memory
    await csvRepoInstance.deleteAll();

    return allRecords;
  }
  async getFileContent(fileName: string) {
    AWS.config = new AWS.Config({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    const s3 = new AWS.S3();

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: fileName,
    };

    const {Body} = await s3.getObject(params).promise();
    let json: AuditLog[] | undefined;
    if (Body) {
      json = await csvtojson().fromString(Body?.toString());
    }
    return json;
  }
}

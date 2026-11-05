import {
  BindingScope,
  CoreBindings,
  Provider,
  inject,
  injectable,
} from '@loopback/core';
import {GetObjectCommand, S3} from '@aws-sdk/client-s3';
import {Filter, defineCrudRepositoryClass, juggler} from '@loopback/repository';

import csvtojson from 'csvtojson';
import {AuditServiceApplication} from '../application';
import {AWSS3Bindings, AwsS3Config} from '../keys';
import {AuditLog} from '../models';
import {QuerySelectedFilesFn} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class QuerySelectedFilesProvider implements Provider<QuerySelectedFilesFn> {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: AuditServiceApplication,
    @inject(AWSS3Bindings.Config, {optional: true})
    private readonly config?: AwsS3Config,
  ) {}

  value(): QuerySelectedFilesFn {
    return async (fileName: string, filter: Filter<AuditLog>) => {
      return this.querySelectedFiles(fileName, filter);
    };
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
    await csvRepoInstance.createAll(json!);

    const allRecords = await csvRepoInstance.find(filter);

    // clear up the memory
    await csvRepoInstance.deleteAll();

    return allRecords;
  }
  async getFileContent(fileName: string) {
    const accessKeyId =
      process.env.AWS_ACCESS_KEY_ID ?? this.config?.accessKeyId;
    const secretAccessKey =
      process.env.AWS_SECRET_ACCESS_KEY ?? this.config?.secretAccessKey;
    // Without a static key pair, leave credentials unset so the SDK uses its
    // default chain (IAM role, IRSA, instance profile), as aws-sdk v2 did.
    const s3Client = new S3({
      ...(accessKeyId && secretAccessKey
        ? {credentials: {accessKeyId, secretAccessKey}}
        : {}),
      region: process.env.AWS_REGION ?? this.config?.region,
      ...this.config,
    });

    const {Body} = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key: fileName,
      }),
    );
    let json: AuditLog[] | undefined;
    if (Body) {
      json = await csvtojson().fromString(await Body.transformToString());
    }
    return json;
  }
}

import {
  BindingKey,
  BindingScope,
  Context,
  CoreBindings,
  inject,
  injectable,
} from '@loopback/core';
import {
  AnyObject,
  DefaultCrudRepository,
  Entity,
  Filter,
  juggler,
  repository,
} from '@loopback/repository';
import {DefaultUserModifyCrudRepository} from '@sourceloop/core';
import {ArchivalApplication} from '../application';
import {ArchivalComponentBindings} from '../keys';
import {ArchiveMapping} from '../models';
import {
  ArchivalMappingRepository,
  RetrievalJobDetailsRepository,
} from '../repositories';
import {
  IBuildWhereConditionService,
  ImportDataExternalSystem,
  JobStatus,
  ProcessImportedData,
} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ImportArchivedDataService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repo: any; //NOSONAR
  constructor(
    @repository(RetrievalJobDetailsRepository)
    public jobDetailsRepo: RetrievalJobDetailsRepository,
    @repository(ArchivalMappingRepository)
    public archivalMappingRepo: ArchivalMappingRepository,
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: ArchivalApplication,
    @inject.context() private context: Context,
    @inject('services.BuildWhereConditionService')
    private buildWhereConditionService: IBuildWhereConditionService,
    @inject(ArchivalComponentBindings.IMPORT_ARCHIVE_DATA)
    private importArchiveData: ImportDataExternalSystem,
    @inject(ArchivalComponentBindings.PROCESS_IMPORT_DATA)
    private processImportedData: ProcessImportedData,
  ) {}

  // 1. add entry in the job processing table return that

  /**
   * start scanning the mapping table and get all the filename matching,
   * read the file get all the data
   * temporarily save the data to the in-memory source
   * filter the required data from there
   * return the json data to user
   */

  async import(jobId: string) {
    const jobDetails = await this.jobDetailsRepo.findById(jobId);
    const modelName = jobDetails.entity;
    const filter = jobDetails.filter;

    const archiveFilter: Filter<ArchiveMapping> =
      await this.buildWhereConditionService.buildConditionForFetch(
        filter,
        modelName,
      );

    const archivedEntries = await this.archivalMappingRepo.find(archiveFilter);

    const data: AnyObject[] = [];

    for (const entry of archivedEntries) {
      const fileContent = await this.importArchiveData(entry.key);
      data.push(...fileContent);
    }

    const dsName = 'db';
    const csvDataSource = new juggler.DataSource({
      name: dsName,
      connector: 'memory',
    });
    await csvDataSource.connect();
    this.application.dataSource(csvDataSource, dsName);

    this.repo = await this.getRepositoryByModelName<Entity>(modelName);
    this.repo.dataSource = csvDataSource;
    // Fill in the json returned from the csv
    await this.repo.createAll(data); //jsondata
    const isSFRepo = this.repo instanceof DefaultUserModifyCrudRepository;
    let allRecords: AnyObject[];
    /**save the records with us and
     * delete the records to clear up the memory
     */
    if (isSFRepo) {
      allRecords = await this.repo.findAll(filter);
      await this.repo.deleteAll(undefined, {skipArchive: true});
    } else {
      allRecords = await this.repo.find(filter);
      await this.repo.deleteAll(undefined, {skipArchive: true});
    }
    //update the respective job status
    await this.jobDetailsRepo.updateById(jobId, {
      status: JobStatus.SUCCESS,
      result: JSON.stringify(allRecords),
    });
    await this.processImportedData(allRecords);
  }

  // sonarignore:start
  private async getRepositoryByModelName<T extends Entity>(
    modelName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<DefaultCrudRepository<T, any> | undefined> {
    // Find all bindings with keys matching 'repositories.*'
    const repositoryBindings =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.context.find<DefaultCrudRepository<any, any>>('repositories.*');

    // Iterate through the bindings to find the matching repository
    for (const binding of repositoryBindings) {
      const repoName = await this.context.get<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        DefaultCrudRepository<any, any>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      >(binding.key as unknown as BindingKey<DefaultCrudRepository<any, any>>);
      if (repoName.entityClass.name === modelName) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return repoName as DefaultCrudRepository<T, any>;
      }
    }
    // sonarignore:end
    return undefined; // Return undefined if no matching repository is found
  }
}

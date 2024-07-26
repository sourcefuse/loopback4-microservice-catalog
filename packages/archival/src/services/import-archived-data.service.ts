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
import {ArchivalMappingRepository, JobDetailsRepository} from '../repositories';
import {
  IBuildWhereConditionService,
  ImportDataExternalSystem,
  JobStatus,
  ProcessImportedData,
} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ImportArchivedDataService {
  repo: any;
  constructor(
    @repository(JobDetailsRepository)
    public jobDetailsRepo: JobDetailsRepository,
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
    const filter = jobDetails.filterInquired;
    const importData: AnyObject = {};

    const archiveFilter: Filter<ArchiveMapping> =
      await this.buildWhereConditionService.buildConditionForFetch(
        filter,
        modelName,
      );

    const archivedEntries = await this.archivalMappingRepo.find(archiveFilter);

    let data: AnyObject[] = [];

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
    this.processImportedData(allRecords);
  }

  async getFilteredData() {}

  private async getRepositoryByModelName<T extends Entity>(
    modelName: string,
  ): Promise<DefaultCrudRepository<T, any> | undefined> {
    // Find all bindings with keys matching 'repositories.*'
    const repositoryBindings =
      this.context.find<DefaultCrudRepository<any, any>>('repositories.*');

    // Iterate through the bindings to find the matching repository
    for (const binding of repositoryBindings) {
      const repository = await this.context.get<
        DefaultCrudRepository<any, any>
      >(binding.key as unknown as BindingKey<DefaultCrudRepository<any, any>>);
      if (repository.entityClass.name === modelName) {
        return repository as DefaultCrudRepository<T, any>;
      }
    }

    return undefined; // Return undefined if no matching repository is found
  }
}

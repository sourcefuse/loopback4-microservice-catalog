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
import {ArchiveMapping, RetrievalJobDetails} from '../models';
import {
  ArchivalMappingRepository,
  RetrievalJobDetailsRepository,
} from '../repositories';
import {
  IBuildWhereConditionService,
  ImportDataExternalSystem,
  JobResponse,
  JobStatus,
  ProcessRetrievedData,
} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ImportArchivedDataService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repo: any; //NOSONAR
  constructor(
    @repository(RetrievalJobDetailsRepository)
    public retrievalJobDetailsRepo: RetrievalJobDetailsRepository,
    @repository(ArchivalMappingRepository)
    public archivalMappingRepo: ArchivalMappingRepository,
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: ArchivalApplication,
    @inject.context() private context: Context,
    @inject('services.BuildWhereConditionService')
    private buildWhereConditionService: IBuildWhereConditionService,
    @inject(ArchivalComponentBindings.IMPORT_ARCHIVE_DATA)
    private importArchiveData: ImportDataExternalSystem,
    @inject(ArchivalComponentBindings.PROCESS_RETRIEVED_DATA)
    private processRetrievedData: ProcessRetrievedData,
  ) {}

  /**
   *This particular method is used to import the data from the external system
   * 1. inserts the job details in the job processing table
   * 2. Then it filters the data from the external system
   * @param entityName - name of the entity on which the data needs to be imported
   * @param filter - filter to be applied on the data to be imported
   * @returns - job id for the import process
   */

  async import(entityName: string, filter: Filter): Promise<JobResponse> {
    const jobResponse = await this.insertToRetrievalJobDetails(
      entityName,
      filter,
    );
    this.filterData(jobResponse.jobId, entityName, filter);
    return jobResponse;
  }

  private async insertToRetrievalJobDetails(
    entityName: string,
    filter: Filter,
  ): Promise<JobResponse> {
    const job = new RetrievalJobDetails({
      status: JobStatus.IN_PROGRESS,
      filter,
      entity: entityName,
    });
    let jobResponse: JobResponse = {jobId: '0'};
    const jobDetails = await this.retrievalJobDetailsRepo.create(job);
    jobResponse = {jobId: jobDetails.id ?? '0'};
    return jobResponse;
  }

  /**
   * Builds a custom where condition from the filter provided to
   * find the possible list of files that need to be imported
   * gets the data from the files and saves it into the in-memory source temporarily
   * and filters the data based on the filter provided
   * updates the job status based on the success or failure of the import process
   * passes the filtered data for further processing
   */
  private async filterData(jobId: string, entityName: string, filter: Filter) {
    const archiveFilter: Filter<ArchiveMapping> =
      await this.buildWhereConditionService.buildConditionForFetch(
        filter,
        entityName,
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

    try {
      await csvDataSource.connect();
      this.application.dataSource(csvDataSource, dsName);

      this.repo = await this.getRepositoryByModelName<Entity>(entityName);
      this.repo.dataSource = csvDataSource;

      // Fill in the json returned from the csv
      await this.repo.createAll(data); // jsondata
      const isSFRepo = this.repo instanceof DefaultUserModifyCrudRepository;
      let allRecords: AnyObject[];
      /** Save the records with us and
       * delete the records to clear up the memory
       */
      if (isSFRepo) {
        allRecords = await this.repo.findAll(filter);
        await this.repo.deleteAll(undefined, {skipArchive: true});
      } else {
        allRecords = await this.repo.find(filter);
        await this.repo.deleteAll(undefined, {skipArchive: true});
      }

      // Update the respective job status
      await this.retrievalJobDetailsRepo.updateById(jobId, {
        status: JobStatus.SUCCESS,
        result: JSON.stringify(allRecords),
      });

      await this.processRetrievedData(allRecords);
    } catch (error) {
      // Log or handle the error appropriately
      console.error('Error during import:', error);
      // Optionally, update the job status to failure
      await this.retrievalJobDetailsRepo.updateById(jobId, {
        status: JobStatus.FAILED,
        result: JSON.stringify({error: error.message}),
      });
      throw error;
    } finally {
      // Close the data source connection
      await csvDataSource.disconnect();
    }
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

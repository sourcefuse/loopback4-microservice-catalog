import {
  BindingScope,
  Provider,
  ValueOrPromise,
  injectable,
} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {RetrievalJobDetails} from '../models';
import {RetrievalJobDetailsRepository} from '../repositories';
import {GetJobDetailsFn, JobResponse, JobStatus} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class RetrieveArchivedDataProvider implements Provider<GetJobDetailsFn> {
  constructor(
    @repository(RetrievalJobDetailsRepository)
    public jobDetailsRepo: RetrievalJobDetailsRepository,
  ) {}
  value(): ValueOrPromise<GetJobDetailsFn> {
    return async (entityName: string, filter?: Filter) => {
      let jobResponse: JobResponse = {jobId: '0'};
      const job = new RetrievalJobDetails({
        status: JobStatus.IN_PROGRESS,
        filter,
        entity: entityName,
      });

      const jobDetails = await this.jobDetailsRepo.create(job);
      jobResponse = {jobId: jobDetails.id ?? '0'};
      return jobResponse;
    };
  }
}

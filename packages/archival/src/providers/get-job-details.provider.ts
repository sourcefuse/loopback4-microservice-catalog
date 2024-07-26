import {
  BindingScope,
  Provider,
  ValueOrPromise,
  injectable,
} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {JobDetails} from '../models';
import {JobDetailsRepository} from '../repositories';
import {GetJobDetailsFn, JobResponse, JobStatus} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class GetJobDetailsProvider implements Provider<GetJobDetailsFn> {
  constructor(
    @repository(JobDetailsRepository)
    public jobDetailsRepo: JobDetailsRepository,
  ) {}
  value(): ValueOrPromise<GetJobDetailsFn> {
    return async (entityName: string, filter?: Filter) => {
      let jobResponse: JobResponse = {jobId: '0'};
      const job = new JobDetails({
        status: JobStatus.IN_PROGRESS,
        filterInquired: filter,
        entity: entityName,
      });

      const jobDetails = await this.jobDetailsRepo.create(job);
      jobResponse = {jobId: jobDetails.id ?? '0'};
      return jobResponse;
    };
  }
}

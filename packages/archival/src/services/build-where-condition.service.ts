import {BindingScope, injectable} from '@loopback/core';
import {AnyObject, Filter} from '@loopback/repository';
import {ArchiveMapping} from '../models';
import {IBuildWhereConditionService} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class BuildWhereConditionService implements IBuildWhereConditionService {
  constructor() {}
  async buildConditionForFetch(
    filter: AnyObject,
    modelName: string,
  ): Promise<Filter<ArchiveMapping>> {
    const archiveFilter: Filter<ArchiveMapping> = {};
    archiveFilter.where = {actedOn: modelName};
    if (filter) {
      archiveFilter.where = {...archiveFilter.where, ...filter};
    }
    return archiveFilter;
  }

  async buildConditionForInsert(
    where: AnyObject | undefined,
  ): Promise<AnyObject> {
    return where ?? {};
  }
}

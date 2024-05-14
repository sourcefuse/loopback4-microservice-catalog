// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, injectable} from '@loopback/core';
import {AnyObject, Count, Where, repository} from '@loopback/repository';
import {SearchQuery} from '../models';
import {SearchQueryRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class SearchQueryHelperService {
  constructor(
    @repository(SearchQueryRepository)
    public searchQueryRepository: SearchQueryRepository,
  ) {}

  deleteAll(where?: Where<SearchQuery>, options?: AnyObject): Promise<Count> {
    return this.searchQueryRepository.deleteAllHard(where, options);
  }
}

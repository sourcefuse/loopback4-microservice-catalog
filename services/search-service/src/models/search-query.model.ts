import {belongsTo, Entity, model, property} from '@loopback/repository';
import {SearchWhereFilterMap} from '..';
import {RecentSearch} from './recent-search.model';

@model({
  name: 'search_query',
})
export class SearchQuery extends Entity {
  @property({
    id: true,
    type: 'String',
    required: false,
    // settings below are needed
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      dataType: 'uuid',
    },
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  match: string;

  @property({
    type: 'number',
  })
  limit?: number;

  @property({
    type: 'string',
  })
  order?: string;

  @property({
    name: 'limit_by_type',
    type: 'boolean',
  })
  limitByType?: boolean;

  @property({
    type: 'number',
  })
  offset?: number;

  @property({
    type: 'array',
    itemType: 'string',
  })
  sources?: string[];

  @property({
    type: 'object',
  })
  where?: SearchWhereFilterMap;

  @belongsTo(
    () => RecentSearch,
    {name: 'recentSearch'},
    {name: 'recent_search_id'},
  )
  recentSearchId: string;

  constructor(data?: Partial<SearchQuery>) {
    super(data);
  }
}

export type SearchQueryWithRelations = SearchQuery;

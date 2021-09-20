import {Model, model, property} from '@loopback/repository';

@model()
export class SearchQuery extends Model {
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
    type: 'boolean',
  })
  limitByType?: boolean;

  @property({
    type: 'number',
  })
  offset?: number;

  constructor(data?: Partial<SearchQuery>) {
    super(data);
  }
}

export type SearchQueryWithRelations = SearchQuery;

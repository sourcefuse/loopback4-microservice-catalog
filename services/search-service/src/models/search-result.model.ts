import {Model, model, property} from '@loopback/repository';

@model()
export class SearchResult extends Model {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  constructor(data?: Partial<SearchResult>) {
    super(data);
  }
}

export type SearchResultWithRelations = SearchResult;

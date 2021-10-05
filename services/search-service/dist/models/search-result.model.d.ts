import { Model } from '@loopback/repository';
export declare class SearchResult extends Model {
    name: string;
    description: string;
    constructor(data?: Partial<SearchResult>);
}
export declare type SearchResultWithRelations = SearchResult;

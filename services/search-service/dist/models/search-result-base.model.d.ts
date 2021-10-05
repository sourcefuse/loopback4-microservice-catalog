import { Model } from '@loopback/repository';
export declare class SearchResultBase extends Model {
    source: string;
    rank: number;
    constructor(data?: Partial<SearchResultBase>);
}
export interface SearchResultBaseRelations {
}
export declare type SearchResultBaseWithRelations = SearchResultBase & SearchResultBaseRelations;

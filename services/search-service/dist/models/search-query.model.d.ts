import { Entity } from '@loopback/repository';
export declare class SearchQuery extends Entity {
    id?: string;
    match: string;
    limit?: number;
    order?: string;
    limitByType?: boolean;
    offset?: number;
    sources?: string[];
    recentSearchId: string;
    constructor(data?: Partial<SearchQuery>);
}
export declare type SearchQueryWithRelations = SearchQuery;

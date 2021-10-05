import { UserModifiableEntity } from '@sourceloop/core';
import { SearchQuery } from './search-query.model';
export declare class RecentSearch extends UserModifiableEntity {
    id?: string;
    userId?: string;
    params: SearchQuery[];
    constructor(data?: Partial<RecentSearch>);
}
export interface RecentSearchRelations {
}
export declare type RecentSearchWithRelations = RecentSearch & RecentSearchRelations;

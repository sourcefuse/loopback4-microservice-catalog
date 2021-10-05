import { Constructor } from '@loopback/core';
import { Model } from '@loopback/repository';
import { SearchResult } from './models';
import { SearchQuery } from './models/search-query.model';
export declare type SearchFunctionType<T> = (query: SearchQuery) => Promise<T[]>;
export declare type SearchableModelsService = {
    add: (model: typeof Model) => Promise<void>;
    delete: (model: typeof Model) => Promise<void>;
    get: () => Promise<typeof Model[]>;
};
export interface Searchable {
    name: string;
    description: string;
}
export declare type SearchableModelsList<T extends Model> = (SearchableModel<T> | typeof Model)[];
export interface SearchServiceConfig<T extends Model = SearchResult> {
    useCustomSequence?: boolean;
    models: SearchableModelsList<T>;
    type?: Constructor<T> & typeof Model;
    controller?: SearchControllerConfig;
}
export declare type SearchControllerConfig = {
    name?: string;
    basePath: string;
    authorizations?: string[];
    authenticate?: boolean;
    recentCount?: number;
    recents?: boolean;
};
export declare class SearchableModel<T extends Model> {
    model: typeof Model;
    columns: ColumnMap<T>;
}
export declare function isSearchableModel<T extends Model>(arg: SearchableModel<T> | typeof Model): arg is SearchableModel<T>;
export declare type ColumnMap<T> = {
    [key in keyof T]+?: string;
};

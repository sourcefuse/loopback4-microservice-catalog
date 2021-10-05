import { Getter, Model } from '@loopback/repository';
import { IAuthUserWithPermissions } from '@sourceloop/core';
import { SearchQuery } from '../models';
import { SearchFunctionType, SearchServiceConfig } from '../types';
export interface SearchControllerBase<T extends Model> {
    readonly searchFn: SearchFunctionType<T>;
    readonly config: SearchServiceConfig;
    /**
     * Implementation of the endpoint `GET /search`.
     * @param query search query
     */
    search(query: SearchQuery, saveInRecents: boolean, getUser: Getter<IAuthUserWithPermissions>): Promise<T[]>;
}
export interface SearchControllerCtor<T extends Model> {
    new (config: SearchServiceConfig, searchFn: SearchFunctionType<T>): SearchControllerBase<T>;
}

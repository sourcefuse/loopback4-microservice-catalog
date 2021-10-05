import { DataObject, Model } from '@loopback/repository';
import { SearchQuery } from '../../models';
import { ColumnMap } from '../../types';
import { SearchQueryBuilder } from '../base';
export declare class PsqlQueryBuilder<T extends Model> extends SearchQueryBuilder<T> {
    unionString: string;
    schema: string;
    constructor(query: DataObject<SearchQuery>, schema?: string);
    search(model: string, columns: Array<keyof T> | ColumnMap<T>): void;
}

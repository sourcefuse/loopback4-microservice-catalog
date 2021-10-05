import { DataObject, Model } from '@loopback/repository';
import { SearchQuery } from '../../models';
import { ColumnMap } from '../../types';
import { SearchQueryBuilder } from '../base';
export declare class MySqlQueryBuilder<T extends Model> extends SearchQueryBuilder<T> {
    unionString: string;
    constructor(query: DataObject<SearchQuery>);
    search(model: string, columns: Array<keyof T> | ColumnMap<T>): void;
}

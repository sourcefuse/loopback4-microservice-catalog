import { AnyObject, DataObject } from '@loopback/repository';
import { Model } from '@loopback/rest';
import { SearchQuery } from '../../models';
import { ColumnMap, SearchableModel } from '../../types';
export declare abstract class SearchQueryBuilder<T extends Model> {
    protected baseQueryList: string[];
    protected limitQuery: string;
    protected orderQuery: string;
    protected query: DataObject<SearchQuery>;
    protected schema?: string;
    constructor(query: DataObject<SearchQuery>, schema?: string);
    abstract search(model: string, columns: Array<keyof T> | ColumnMap<T>): void;
    abstract unionString: string;
    limit(): void;
    order(columns: Array<keyof T>): void;
    build(models: (SearchableModel<T> | typeof Model)[], type?: typeof Model): {
        query: string;
        params: AnyObject | (string | AnyObject)[];
    };
    paramsBuild(param: string): AnyObject | Array<AnyObject | string>;
    queryBuild(models: (SearchableModel<T> | typeof Model)[], type?: typeof Model): string;
}

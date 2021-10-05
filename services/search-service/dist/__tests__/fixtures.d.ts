import { Entity } from '@loopback/repository';
import { SearchQueryBuilder } from '../classes';
import { ColumnMap } from '../types';
export declare class TestSearchModel extends Entity {
    description: string;
    name: string;
}
export declare class TestSearched extends Entity {
    description: string;
    name: string;
}
export declare class TestSearchedCustom extends Entity {
    about: string;
    identifier: string;
}
export declare class TestQueryBuilder extends SearchQueryBuilder<TestSearchModel> {
    unionString: string;
    search(modelName: string, columns: (keyof TestSearchModel)[] | ColumnMap<TestSearchModel>): void;
}

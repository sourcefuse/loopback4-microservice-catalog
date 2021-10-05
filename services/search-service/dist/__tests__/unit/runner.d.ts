import { SearchQueryBuilder } from '../../classes';
import { SearchQuery } from '../../models';
import { DataObject } from '@loopback/repository';
import { SearchableModelsList } from '../../types';
import { TestSearchModel } from '../fixtures';
import { BuilderTest } from './types';
export declare function buildTestsRunner(builderClass: new (search: DataObject<SearchQuery>, schema?: string) => SearchQueryBuilder<TestSearchModel>, tests: Array<BuilderTest>, match: string, expect: Internal, models: SearchableModelsList<TestSearchModel>): () => void;

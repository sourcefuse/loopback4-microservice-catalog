import { Model } from '@loopback/repository';
import { SearchControllerConfig } from '../types';
import { SearchControllerCtor } from './types';
export declare function defineSearchController<T extends Model>(modelCtor: typeof Model, options?: SearchControllerConfig): SearchControllerCtor<T>;

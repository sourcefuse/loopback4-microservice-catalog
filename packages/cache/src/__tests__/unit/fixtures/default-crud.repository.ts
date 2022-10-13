// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  AnyObject,
  DefaultCrudRepository,
  Entity,
  Filter,
  FilterExcludingWhere,
  Options,
} from '@loopback/repository';
import {mockData} from './data';

export let superFindCalled = false;
export let superFindAllCalled = false;

export class MockDefaultCrudRepository extends DefaultCrudRepository<
  Entity,
  string,
  {}
> {
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  find(filter?: Filter<Entity> | undefined, options?: AnyObject | undefined) {
    superFindAllCalled = true;
    return Promise.resolve([mockData]);
  }
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  findById(
    id: string,
    filter?: FilterExcludingWhere<Entity>,
    options?: Options,
  ) {
    superFindCalled = true;
    return Promise.resolve(mockData);
  }
}

export function resetCalls() {
  superFindCalled = false;
  superFindAllCalled = false;
}

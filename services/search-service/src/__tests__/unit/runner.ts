// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {SearchQueryBuilder} from '../../classes';
import {SearchQuery} from '../../models';
import {DataObject} from '@loopback/repository';
import {SearchableModelsList} from '../../types';
import {TestSearchModel} from '../fixtures';
import {BuilderTest} from './types';

export function buildTestsRunner(
  builderClass: new (
    search: DataObject<SearchQuery>,
    schema?: string,
  ) => SearchQueryBuilder<TestSearchModel>,
  tests: Array<BuilderTest>,
  match: string,
  matchOutput: string[],
  expect: Internal,
  models: SearchableModelsList<TestSearchModel>,
) {
  return () => {
    tests.forEach(test => {
      it(test.it, () => {
        const builder = new builderClass({
          match,
          ...test.params,
        });
        if (test.error) {
          try {
            builder.build(models, [], TestSearchModel);
            throw new Error(`Expected: ${test.message}, but did'nt get one`);
          } catch (err) {
            expect(err).to.be.instanceOf(test.error);
            expect(err.message).to.be.equal(test.message);
          }
        } else {
          expect(builder.build(models, [], TestSearchModel)).to.deepEqual({
            query: test.expects,
            params: matchOutput,
          });
        }
      });
    });
  };
}

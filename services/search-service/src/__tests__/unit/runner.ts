import {SearchQueryBuilder} from '../../classes';
import {SearchQuery} from '../../models';
import {DataObject} from '@loopback/repository';
import {SearchableModelsList} from '../../types';
import {TestSearched, TestSearchedCustom, TestSearchModel} from '../fixtures';
import {BuilderTest} from './types';

export function buildTestsRunner(
  builderClass: new (
    search: DataObject<SearchQuery>,
    schema?: string,
  ) => SearchQueryBuilder<TestSearchModel>,
  tests: Array<BuilderTest>,
  match: string,
  expect: Internal,
) {
  const models: SearchableModelsList<TestSearchModel> = [
    TestSearched,
    {
      model: TestSearchedCustom,
      columns: {
        description: 'about',
        name: 'identifier',
      },
    },
  ];
  return () => {
    tests.forEach(test => {
      it(test.it, () => {
        const builder = new builderClass({
          match,
          ...test.params,
        });
        if (test.error) {
          try {
            builder.build(models, TestSearchModel);
            throw new Error(`Expected: ${test.message}, but did'nt get one`);
          } catch (err) {
            expect(err).to.be.instanceOf(test.error);
            expect(err.message).to.be.equal(test.message);
          }
        } else {
          expect(builder.build(models, TestSearchModel)).to.deepEqual([
            test.expects,
            [match],
          ]);
        }
      });
    });
  };
}

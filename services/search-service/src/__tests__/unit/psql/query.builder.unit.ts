import {BuilderTest} from '../types';
import {buildTestsRunner} from '../runner';
import {PsqlQueryBuilder} from '../../../classes';
import {expect} from '@loopback/testlab';
import {testModelList} from '../..';

describe('PostgreSQL QueryBuilder', () => {
  const testList: Array<BuilderTest> = [
    {
      params: {},
      it: 'should build a query with no options',
      expects:
        "(SELECT description, name, 'TestSearched' as source, ts_rank_cd(to_tsvector(f_concat_ws(' ', description, name)), to_tsquery($1)) as rank" +
        " from public.TestSearched where to_tsvector(f_concat_ws(' ', description, name)) @@ to_tsquery($1))" +
        ' UNION ALL ' +
        "(SELECT about as description, identifier as name, 'TestSearchedCustom' as source, ts_rank_cd(to_tsvector(f_concat_ws(' ', about, identifier)), to_tsquery($1)) as rank" +
        " from public.TestSearchedCustom where to_tsvector(f_concat_ws(' ', about, identifier)) @@ to_tsquery($1))" +
        ' ORDER BY rank DESC',
    },
  ];
  describe(
    'with match parameter',
    buildTestsRunner(
      PsqlQueryBuilder,
      testList,
      'match',
      ['match:*'],
      expect,
      testModelList,
    ),
  );
});

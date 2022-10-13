// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BuilderTest} from '../types';
import {buildTestsRunner} from '../runner';
import {MySqlQueryBuilder} from '../../../classes';
import {expect} from '@loopback/testlab';
import {testModelList} from '../..';

describe('MySQL QueryBuilder', () => {
  const testList: Array<BuilderTest> = [
    {
      params: {},
      it: 'should build a query with no options',
      expects:
        "(SELECT description, name, 'TestSearched' as source, MATCH (description, name) AGAINST (':0') AS rank" +
        " from TestSearched where MATCH (description, name) AGAINST (':0'))" +
        ' UNION ALL ' +
        "(SELECT about as description, identifier as name, 'TestSearchedCustom' as source, MATCH (about, identifier) AGAINST (':0') AS rank" +
        " from TestSearchedCustom where MATCH (about, identifier) AGAINST (':0'))" +
        ' ORDER BY rank DESC',
    },
  ];
  describe(
    'with match parameter',
    buildTestsRunner(
      MySqlQueryBuilder,
      testList,
      'match',
      ['match'],
      expect,
      testModelList,
    ),
  );
});

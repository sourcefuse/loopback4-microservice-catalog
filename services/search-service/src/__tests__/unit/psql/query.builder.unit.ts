// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {buildTestsRunner} from '../runner';
import {PsqlQueryBuilder} from '../../../classes';
import {expect} from '@loopback/testlab';
import {testModelList, testModelListWithIdentifier} from '../..';
import {AnyObject} from '@loopback/repository';

describe('PostgreSQL QueryBuilder', () => {
  const queryPart =
    " from public.TestSearchedCustom where to_tsvector(public.f_concat_ws(' ', about, identifier)) @@ to_tsquery($1))";

  describe('_formatAndSanitize', () => {
    it('should preserve dots in search terms', () => {
      const builder = new PsqlQueryBuilder({match: 'Deal 10.1'});
      const result = (builder as AnyObject)._formatAndSanitize('Deal 10.1');
      expect(result).to.equal('Deal:*<->10.1:*');
    });

    it('should handle project names with dots', () => {
      const builder = new PsqlQueryBuilder({match: 'test'});
      const result = (builder as AnyObject)._formatAndSanitize('testlift.QA');
      expect(result).to.equal('testlift.QA:*');
    });

    it('should handle multiple dots in different positions', () => {
      const builder = new PsqlQueryBuilder({match: 'test'});
      const result = (builder as AnyObject)._formatAndSanitize(
        'Project.Alpha.Beta',
      );
      expect(result).to.equal('Project.Alpha.Beta:*');
    });

    it('should handle mix of dots and special characters', () => {
      const builder = new PsqlQueryBuilder({match: 'test'});
      const result = (builder as AnyObject)._formatAndSanitize(
        'Deal.10 & Test.1.5',
      );
      expect(result).to.equal('Deal.10:*<->Test.1.5:*');
    });

    it('should handle complex search with dots and spaces', () => {
      const builder = new PsqlQueryBuilder({match: 'test'});
      const result = (builder as AnyObject)._formatAndSanitize(
        'Version 2.5 (Release)',
      );
      expect(result).to.equal('Version:*<->2.5:*<->Release:*');
    });
  });
  describe(
    'with match parameter',
    buildTestsRunner(
      PsqlQueryBuilder,
      [
        {
          params: {},
          it: 'should build a query with no options',
          expects:
            "(SELECT description, name, 'TestSearched' as source, ts_rank_cd(to_tsvector(public.f_concat_ws(' ', description, name)), to_tsquery($1)) as rank    " +
            " from public.TestSearched where to_tsvector(public.f_concat_ws(' ', description, name)) @@ to_tsquery($1))" +
            ' UNION ALL ' +
            "(SELECT about as description, identifier as name, 'TestSearchedCustom' as source, ts_rank_cd(to_tsvector(public.f_concat_ws(' ', about, identifier))," +
            ` to_tsquery($1)) as rank    ${queryPart}` +
            ' ORDER BY rank DESC',
        },
      ],
      'match',
      ['match:*'],
      expect,
      testModelList,
    ),
  );
  describe(
    'with custom identifier',
    buildTestsRunner(
      PsqlQueryBuilder,
      [
        {
          params: {},
          it: 'should build a query with no options',
          expects:
            "(SELECT description, name, 'TestSearched' as source, ts_rank_cd(to_tsvector(public.f_concat_ws(' ', description, name)), to_tsquery($1)) as rank    " +
            " from public.TestSearched where to_tsvector(public.f_concat_ws(' ', description, name)) @@ to_tsquery($1))" +
            ' UNION ALL ' +
            "(SELECT about as description, identifier as name, 'TestSearchedCustom' as source, ts_rank_cd(to_tsvector(public.f_concat_ws(' ', about, identifier))," +
            ` to_tsquery($1)) as rank    ${queryPart}` +
            ' UNION ALL ' +
            "(SELECT about as description, identifier as name, 'CustomIdentifier' as source," +
            ` ts_rank_cd(to_tsvector(public.f_concat_ws(' ', about, identifier)), to_tsquery($1)) as rank    ${queryPart}` +
            ' ORDER BY rank DESC',
        },
      ],
      'match',
      ['match:*'],
      expect,
      testModelListWithIdentifier,
    ),
  );
});

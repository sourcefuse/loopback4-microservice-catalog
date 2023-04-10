import {Getter} from '@loopback/core';
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {ExportColumnsBuilderService} from '../../services';
import {IColumnHandler} from '../../types';
import {dummyLog} from '../sample-data/dummy-log';

describe('column builder service', function () {
  let exportColumnsBuilderService: ExportColumnsBuilderService;
  const getter: Getter<IColumnHandler[]> = function () {
    return Promise.resolve([
      {
        columnName: 'id',
        columnValueBuilder() {
          return '1';
        },
      },
    ]);
  };

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  it('fetches column names from the extensions', async () => {
    const exportColumnNames =
      await exportColumnsBuilderService.exportColumnNames();
    expect(exportColumnNames).to.be.eql(['id']);
  });

  it('fetches export columns data from the extensions', async () => {
    const exportColumnData =
      await exportColumnsBuilderService.columnValueBuilder(dummyLog);
    expect(exportColumnData).to.be.eql(['1']);
  });

  function setUp() {
    exportColumnsBuilderService = new ExportColumnsBuilderService(getter);
  }
});

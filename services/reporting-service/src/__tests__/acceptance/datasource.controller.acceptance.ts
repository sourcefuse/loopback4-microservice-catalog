import {RestApplication} from '@loopback/rest';
import {Client, expect} from '@loopback/testlab';
import {ColumnForDataSourceModel} from '../../interfaces';
import {DataSourcesService} from '../../services/data-sources.service';
import {setUpApplication} from './helper';

describe('DataSourcesController', () => {
  let app: RestApplication;
  let client: Client;
  let dataSourcesService: DataSourcesService;

  before(async () => {
    ({app, client} = await setUpApplication());

    dataSourcesService = await app.get('services.DataSourcesService');
  });

  after(async () => {
    await app.stop();
  });

  it('counts data sources', async () => {
    const count = await dataSourcesService.getTotalDataSourceCount();
    await client
      .get('/data-sources/count')
      .expect(200)
      .expect(res => {
        expect(res.body).to.have.property('count').which.is.a.Number();
        expect(res.body.count).to.eql(count);
      });
  });

  it('lists data sources', async () => {
    const dataSourceList = await dataSourcesService.listdataSources();
    await client
      .get('/data-sources')
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.an.Array().with.lengthOf(dataSourceList.length);
        expect(res.body).to.deepEqual(dataSourceList);
      });
  });

  it('lists columns for a data source', async () => {
    const testDataSource = 'testDataSource';
    const columns =
      await dataSourcesService.listDataSourceColumns(testDataSource);

    await client
      .get(`/data-sources/${testDataSource}/columns`)
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.an.Array().with.lengthOf(columns.length);

        res.body.forEach((column: ColumnForDataSourceModel, index: number) => {
          expect(column).to.have.properties([
            'columnName',
            'dataSourceName',
            'displayName',
            'originalDataType',
            'dataType',
          ]);
          const expectedColumn = columns[index].toObject();
          expect(column).to.deepEqual(expectedColumn);
        });
      });
  });
});

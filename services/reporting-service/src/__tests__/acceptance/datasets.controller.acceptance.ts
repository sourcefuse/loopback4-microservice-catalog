import {RestApplication} from '@loopback/rest';
import {Client, expect} from '@loopback/testlab';
import {DataSet} from '../../models';
import {setUpApplication} from './helper';

describe('DataSetsController', () => {
  let app: RestApplication;
  let client: Client;
  let dataSetId: string;

  before(async () => {
    ({app, client} = await setUpApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('creates a new DataSet', async () => {
    const newDataSet: Partial<DataSet> = {
      name: 'Test DataSet',
      dataSetQuery: {
        select: {
          fields: ['public.mock_table.column1', 'public.mock_table.column2'],
        },

        from: 'public.mock_table',
      },
    };

    await client
      .post('/data-sets')
      .send(newDataSet)
      .expect(200)
      .then(response => {
        expect(response.body).to.containDeep(newDataSet);
        expect(response.body).to.have.property('id');
        dataSetId = response.body.id;
      });
  });

  it('counts DataSets', async () => {
    await client
      .get('/data-sets/count')
      .expect(200)
      .then(response => {
        expect(response.body).to.have.property('count').which.is.a.Number();
      });
  });

  it('lists all DataSets', async () => {
    await client
      .get('/data-sets')
      .expect(200)
      .then(response => {
        expect(response.body).to.be.an.Array();
      });
  });

  it('retrieves a DataSet by ID', async () => {
    await client
      .get(`/data-sets/${dataSetId}`)
      .expect(200)
      .then(response => {
        expect(response.body).to.have.property('id', dataSetId);
      });
  });

  it('deletes a DataSet by ID', async () => {
    await client.del(`/data-sets/${dataSetId}`).expect(204);
  });
});

import {RestApplication} from '@loopback/rest';
import {Client, expect} from '@loopback/testlab';
import {WidgetsRepository} from '../../repositories';
import {setUpApplication} from './helper';

describe('WidgetController', () => {
  let app: RestApplication;
  let client: Client;
  let widgetId: string;
  before(async () => {
    ({app, client} = await setUpApplication());
  });
  before(givenRepositories);
  after(async () => {
    await app.stop();
  });

  it('creates a new widget', async () => {
    const widgetData = {
      name: 'New Widget',
      datasetId: 'data-set-id',
    };

    const res = await client.post('/widgets').send(widgetData).expect(200);
    widgetId = res.body.id;
    expect(res.body).to.containEql(widgetData);
  });

  it('retrieves list of widgets', async () => {
    await client
      .get('/widgets')
      .expect(200)
      .then(res => {
        expect(res.body).to.be.Array();
      });
  });

  it('retrieves a widget by ID', async () => {
    await client
      .get(`/widgets/${widgetId}`)
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('id', widgetId);
      });
  });

  async function givenRepositories() {
    app.bind('repositories.WidgetsRepository').toClass(WidgetsRepository);
  }
});

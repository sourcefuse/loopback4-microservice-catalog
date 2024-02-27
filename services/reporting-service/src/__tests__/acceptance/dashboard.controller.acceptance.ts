import {RestApplication} from '@loopback/rest';
import {Client, expect} from '@loopback/testlab';
import {CreateDashboardDto} from '../../models';
import {
  DashboardRepository,
  DashboardWidgetRepository,
} from '../../repositories';
import {setUpApplication} from './helper';

describe('DashboardController', () => {
  let app: RestApplication;
  let client: Client;
  let dashboardId: string;

  before(async () => {
    ({app, client} = await setUpApplication());
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await givenRepositories();
  });

  // Test for creating a new dashboard
  it('creates a new dashboard', async () => {
    const newDashboard: CreateDashboardDto = {
      name: 'Test Dashboard',
      description: 'Test Description',
      layout: {layoutConfig: 'test'},
      widgetIds: ['widget1', 'widget2'],
    };

    const response = await client
      .post('/dashboards')
      .send(newDashboard)
      .expect(200);

    dashboardId = response.body.id;

    expect(response.body).to.containDeep({
      name: newDashboard.name,
      description: newDashboard.description,
      layout: newDashboard.layout,
    });
  });

  // Test for retrieving a list of dashboards
  it('retrieves list of dashboards', async () => {
    const response = await client.get('/dashboards').expect(200);
    expect(response.body).to.be.Array();
  });

  // Test for retrieving a dashboard by ID
  it('retrieves a dashboard by ID', async () => {
    const response = await client.get(`/dashboards/${dashboardId}`).expect(200);
    expect(response.body).to.have.property('id', dashboardId);
  });

  // Test for updating a dashboard
  it('updates a dashboard', async () => {
    const updatedData = {name: 'Updated Name'};
    await client
      .patch(`/dashboards/${dashboardId}`)
      .send(updatedData)
      .expect(204);

    const updatedDashboardResponse = await client.get(
      `/dashboards/${dashboardId}`,
    );
    expect(updatedDashboardResponse.body.name).to.equal('Updated Name');
  });

  // Test for deleting a dashboard
  it('deletes a dashboard', async () => {
    await client.del(`/dashboards/${dashboardId}`).expect(204);
    await client.get(`/dashboards/${dashboardId}`).expect(404);
  });

  // Test for dashboard count
  it('counts dashboards', async () => {
    const response = await client.get('/dashboards/count').expect(200);
    expect(response.body.count).to.be.Number();
  });

  // Setup repositories for testing
  async function givenRepositories() {
    app.bind('repositories.DashboardRepository').toClass(DashboardRepository);
    app
      .bind('repositories.DashboardWidgetRepository')
      .toClass(DashboardWidgetRepository);
  }
});

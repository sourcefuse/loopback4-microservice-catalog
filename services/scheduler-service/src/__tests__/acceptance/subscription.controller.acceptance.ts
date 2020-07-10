import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {Subscription} from '../../models';
import {SubscriptionRepository} from '../../repositories';
import {SchedulerApplication} from '../application';
import {setUpApplication} from './helper';

describe('Subscription Controller', () => {
  let app: SchedulerApplication;
  let client: Client;
  let subscriptionRepo: SubscriptionRepository;
  const pass = 'test_password';
  const testUser = {
    id: 1,
    username: 'test_user',
    password: pass,
    permissions: [
      'ViewSubscription',
      'CreateSubscription',
      'UpdateSubscription',
      'DeleteSubscription',
    ],
  };

  const token = jwt.sign(testUser, 'kdskssdkdfs', {
    expiresIn: 180000,
    issuer: 'sf',
  });

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());
  before(givenRepositories);
  afterEach(deleteMockData);

  it('gives status 422 when data sent is incorrect', async () => {
    const reqData = {};
    const response = await client
      .post(`/subscriptions`)
      .send(reqData)
      .expect(422);

    expect(response).to.have.property('error');
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client
      .get(`/calendars/subscriptions/me`)
      .expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`/calendars/subscriptions/me`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('get subscriptions gives status 200 when token is passed', async () => {
    await client
      .get(`/subscriptions`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 200 when token and filter with where is passed', async () => {
    await client
      .get(`/calendars/subscriptions/me?filter[where][deleted]=false`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 200 when token and filter without where is passed', async () => {
    await client
      .get(`/calendars/subscriptions/me?filter[include][][relation]=calendar`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when Subscription details are not correct', async () => {
    const subscriptionToAdd = {};

    await client
      .post(`/subscriptions`)
      .set('authorization', `Bearer ${token}`)
      .send(subscriptionToAdd)
      .expect(422);
  });

  it('gives status 200 and Subscription detail when Subscription is added', async () => {
    const reqToAddSubscription = await addSubscription();
    expect(reqToAddSubscription.status).to.be.equal(200);

    const response = await client
      .get(`/subscriptions/${reqToAddSubscription.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.properties(['calendarId']);
    expect(response.body.calendarId).to.be.equal('dummy');
  });

  it('updates Subscription successfully using PATCH request', async () => {
    const reqToAddSubscription = await addSubscription();

    const subscriptionToUpdate = {
      calendarId: 'updatedId',
    };

    await client
      .patch(`/subscriptions/${reqToAddSubscription.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(subscriptionToUpdate)
      .expect(204);

    const response = await client
      .get(`/subscriptions/${reqToAddSubscription.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['calendarId']);
    expect(response.body.calendarId).to.be.equal('updatedId');
  });

  it('updates Subscription using PUT request', async () => {
    const reqToAddSubscription = await addSubscription();

    const subscriptionToUpdate = {
      identifier: 'dummy',
      calendarId: 'updatedId',
    };

    await client
      .put(`/subscriptions/${reqToAddSubscription.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(subscriptionToUpdate)
      .expect(204);

    const response = await client
      .get(`/subscriptions/${reqToAddSubscription.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['calendarId']);
    expect(response.body.calendarId).to.be.equal('updatedId');
  });

  it('deletes a subscription successfully', async () => {
    const reqToAddSubscription = await addSubscription();
    await client
      .del(`/subscriptions/${reqToAddSubscription.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`/subscriptions/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addSubscription() {
    const subscriptionToAdd = new Subscription({
      identifier: 'dummy',
      calendarId: 'dummy',
    });

    return client
      .post(`/subscriptions`)
      .set('authorization', `Bearer ${token}`)
      .send(subscriptionToAdd);
  }

  async function deleteMockData() {
    await subscriptionRepo.deleteAllHard();
  }

  async function givenRepositories() {
    subscriptionRepo = await app.getRepository(SubscriptionRepository);
  }
});

import {Context} from '@loopback/context';
import {AnyObject} from '@loopback/repository';
import {Client, expect} from '@loopback/testlab';
import {AuthenticationBindings} from 'loopback4-authentication';
import {TaskPermssionKey} from '../../enums/permission-key.enum';
import {EventRepository, EventWorkflowRepository} from '../../repositories';
import {getToken, setupApplication} from '../fixtures/test-helper';
import {TestTaskServiceApplication} from '../fixtures/test.application';

describe('EventController: Acceptance', () => {
  let app: TestTaskServiceApplication;
  let client: Client;
  const mock = {
    key: 'test',
    payload: {
      test: 'test',
    },
    source: 'test',
    description: 'test',
    timestamp: new Date('2020-01-01').getTime(),
  };
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    await seedData();
  });

  after(async () => {
    await app.stop();
  });

  it('find: should return 200 with list of events', async () => {
    const token = getToken([TaskPermssionKey.ViewEvent]);
    const data = await client
      .get('/events')
      .set('Authorization', token)
      .expect(200);
    expect(data.body).to.have.length(1);
    expect(data.body[0]).to.have.properties([
      'key',
      'payload',
      'source',
      'description',
      'id',
    ]);
    expect(data.body[0].key).to.equal(mock.key);
    expect(data.body[0].payload).to.deepEqual(mock.payload);
    expect(data.body[0].source).to.equal(mock.source);
    expect(data.body[0].description).to.equal(mock.description);
  });

  it('findById: should return 200 with an event', async () => {
    const token = getToken([TaskPermssionKey.ViewEvent]);
    const data = await client
      .get(`/events/1`)
      .set('Authorization', token)
      .expect(200);
    expect(data.body).to.have.properties([
      'key',
      'payload',
      'source',
      'description',
      'id',
    ]);
    expect(data.body.key).to.equal(mock.key);
  });

  it('count: should return 200 with an event', async () => {
    const token = getToken([TaskPermssionKey.ViewEvent]);
    const data = await client
      .get(`/events/count`)
      .set('Authorization', token)
      .expect(200);
    expect(data.body).to.deepEqual({
      count: 1,
    });
  });

  it('mapEventToWorkflow: should create a mapping between event and workflow', async () => {
    const token = getToken([TaskPermssionKey.ViewEvent]);
    await client
      .post(`/events/mapping`)
      .set('Authorization', token)
      .send({
        eventKey: 'event',
        workflowKey: 'workflow',
      })
      .expect(204);
    const repo = await getRepo<EventWorkflowRepository>(
      'repositories.EventWorkflowRepository',
    );
    const [created] = await repo.find();
    expect(created).to.have.properties([
      'eventKey',
      'workflowKey',
      'id',
      'createdOn',
      'modifiedOn',
      'createdBy',
      'modifiedBy',
      'deleted',
    ]);
    expect(created.workflowKey).to.equal('workflow');
    expect(created.eventKey).to.equal('event');
  });

  async function seedData() {
    const repo = await getRepo<EventRepository>('repositories.EventRepository');
    await repo.create(mock);
  }

  async function getRepo<T>(classString: string) {
    const tempContext = new Context(app, 'test');
    tempContext.bind<AnyObject>(AuthenticationBindings.CURRENT_USER).to({
      id: 'test',
      username: 'test',
      userTenantId: 'test',
    });
    return tempContext.getSync<T>(classString);
  }
});

import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {
  CalendarRepository,
  WorkingHourRepository,
  SubscriptionRepository,
} from '../../repositories';
import {SchedulerApplication} from '../application';
import {setUpApplication} from './helper';
import {Subscription} from '../../models/subscription.model';

describe('Calendar Controller', () => {
  let app: SchedulerApplication;
  let client: Client;
  let calendarRepo: CalendarRepository;
  let workingHourRepo: WorkingHourRepository;
  let subscriptionRepo: SubscriptionRepository;
  const pass = 'test_password';
  const identifier = 'test@gmail.com';
  const testUser = {
    id: identifier,
    username: 'test_user',
    password: pass,
    permissions: [
      'ViewCalendar',
      'CreateCalendar',
      'UpdateCalendar',
      'DeleteCalendar',
      'ViewWorkingHour',
      'CreateWorkingHour',
      'UpdateWorkingHour',
      'DeleteWorkingHour',
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
    const response = await client.post(`/calendars`).send(reqData).expect(422);

    expect(response).to.have.property('error');
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(`/calendars`).expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`/calendars`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when calendar details are not correct', async () => {
    const calendarToAdd = {};

    await client
      .post(`/calendars`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToAdd)
      .expect(422);
  });

  it('gives status 200, calendar detail when calendar is added', async () => {
    const reqToAddCalendar = await addCalendar();

    expect(reqToAddCalendar.status).to.be.equal(200);
    const response = await client
      .get(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['identifier']);
    expect(response.body.identifier).to.be.equal(identifier);
  });

  it('gives status 200, calendar detail when calendar is added without working hours', async () => {
    const calendarToAdd = {
      source: 'internal',
      enableWorkingHours: true,
      identifier,
      summary: 'string',
      timezone: 'ist',
    };

    const reqToAddCalendar = await client
      .post(`/calendars`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToAdd);

    expect(reqToAddCalendar.status).to.be.equal(200);
    const response = await client
      .get(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['identifier']);
    expect(response.body.identifier).to.be.equal(identifier);
  });

  it('add workinghours when calendar is added', async () => {
    const reqToAddCalendar = await addCalendar();

    const workingHoursResponse = await client
      .get(`/working-hours/${reqToAddCalendar.body.workingHours[0].id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(workingHoursResponse.body).to.have.properties(['dayOfWeek']);
    expect(workingHoursResponse.body.dayOfWeek).to.be.equal(1);
  });

  it('add subscription when calendar is added', async () => {
    const calendarToAdd = {
      source: 'internal',
      enableWorkingHours: true,
      location: 'location',
      identifier,
      summary: 'string',
      timezone: 'ist',
      subscription: {
        identifier,
        fgColor: 'red',
      },
    };

    await client
      .post(`/calendars/calendarSubscription`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToAdd)
      .expect(200);
  });

  it('add subscription when a subscription already exist when calendar is added', async () => {
    const subscriptionToAdd = new Subscription({
      identifier,
      calendarId: 'dummy',
    });
    await client
      .post(`/subscriptions`)
      .set('authorization', `Bearer ${token}`)
      .send(subscriptionToAdd);

    const calendarToAdd = {
      source: 'internal',
      enableWorkingHours: true,
      location: 'location',
      identifier,
      summary: 'string',
      timezone: 'ist',
      subscription: {
        identifier,
        fgColor: 'red',
      },
    };

    await client
      .post(`/calendars/calendarSubscription`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToAdd)
      .expect(200);
  });

  it('gives Not Found when subscription is not passed when calendar is added', async () => {
    const calendarToAdd = {
      source: 'internal',
      identifier,
    };

    await client
      .post(`/calendars/calendarSubscription`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToAdd)
      .expect(404);
  });

  it('updates calendar successfully using PATCH request', async () => {
    const reqToAddCalendar = await addCalendar();

    const calendarToUpdate = {
      location: 'updated_location',
    };

    await client
      .patch(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToUpdate)
      .expect(204);

    const response = await client
      .get(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['location']);
    expect(response.body.location).to.be.equal('updated_location');
  });

  it('updates calendar using PUT request', async () => {
    const reqToAddCalendar = await addCalendar();

    const calendarToUpdate = {
      identifier,
    };

    await client
      .put(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToUpdate)
      .expect(204);
  });

  it('updates workinghours along with calendar using PUT request', async () => {
    const reqToAddCalendar = await addCalendar();

    const calendarToUpdate = {
      identifier,
      workingHours: [
        {
          dayOfWeek: 2,
          calendarId: reqToAddCalendar.body.id,
          id: reqToAddCalendar.body.workingHours[0].id,
        },
      ],
    };

    await client
      .put(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToUpdate)
      .expect(204);

    const workingHoursResponse = await client
      .get(`/working-hours/`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(workingHoursResponse.body[0]).to.have.properties(['dayOfWeek']);
    expect(workingHoursResponse.body[0].dayOfWeek).to.be.equal(2);
  });

  it('gives duplicate dayOfWeek error message when duplicate dayOfWeek is passed in put request', async () => {
    const reqToAddCalendar = await addCalendar();

    const calendarToUpdate = {
      identifier,
      workingHours: [
        {
          dayOfWeek: 2,
          calendarId: reqToAddCalendar.body.id,
          id: reqToAddCalendar.body.workingHours[0].id,
        },
        {
          dayOfWeek: 2,
          calendarId: reqToAddCalendar.body.id,
          id: reqToAddCalendar.body.workingHours[0].id,
        },
      ],
    };

    await client
      .put(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToUpdate)
      .expect(422);
  });

  it('add working hours when working hour id is blank in put request', async () => {
    const reqToAddCalendar = await addCalendar();

    const calendarToUpdate = {
      identifier,
      workingHours: [
        {
          dayOfWeek: 2,
          calendarId: reqToAddCalendar.body.id,
          id: reqToAddCalendar.body.workingHours[0].id,
        },
        {
          dayOfWeek: 1,
          calendarId: reqToAddCalendar.body.id,
          id: '',
        },
      ],
    };

    await client
      .put(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToUpdate)
      .expect(204);
  });

  it('gives error message when incorect calendar Id passed in put request', async () => {
    const reqToAddCalendar = await addCalendar();

    const calendarToUpdate = {
      identifier,
      workingHours: [
        {
          dayOfWeek: 2,
          calendarId: reqToAddCalendar.body.id,
          id: reqToAddCalendar.body.workingHours[0].id,
        },
        {
          dayOfWeek: 1,
          calendarId: 'dummy',
          id: reqToAddCalendar.body.workingHours[0].id,
        },
      ],
    };

    await client
      .put(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToUpdate)
      .expect(422);
  });

  it('deletes a calendar successfully', async () => {
    const reqToAddCalendar = await addCalendar();
    await client
      .del(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`/calendars/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addCalendar() {
    const calendarToAdd = {
      source: 'internal',
      enableWorkingHours: true,
      location: 'location',
      identifier,
      summary: 'string',
      timezone: 'ist',
      workingHours: [
        {
          createdOn: '2020-06-06T09:50:34.246Z',
          modifiedOn: '2020-06-06T09:50:33.246Z',
          dayOfWeek: 1,
          end: '09:50:33.246Z',
          start: '09:50:33.246Z',
          calendarId: '',
        },
      ],
    };

    return client
      .post(`/calendars`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToAdd);
  }

  async function deleteMockData() {
    await calendarRepo.deleteAllHard();
    await workingHourRepo.deleteAllHard();
    await subscriptionRepo.deleteAllHard();
  }

  async function givenRepositories() {
    calendarRepo = await app.getRepository(CalendarRepository);
    workingHourRepo = await app.getRepository(WorkingHourRepository);
    subscriptionRepo = await app.getRepository(SubscriptionRepository);
  }
});

import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {SubscriptionRepository} from '../../repositories';
import sinon from 'sinon';
import {CalendarEventService} from '../../services';
import {EventAttendeeView, Subscription} from '../../models';
import {Filter} from '@loopback/repository';

describe('Calendar Event Service', () => {
  let subscriptionRepo: StubbedInstanceWithSinonAccessor<SubscriptionRepository>;
  let calendarEventService: CalendarEventService;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('checks for primary subscription and returns it', () => {
    it('returns the subscription', async () => {
      const calendarId = 'dummy';
      const subscription = new Subscription({
        id: 'dummy',
        calendarId: calendarId,
        isPrimary: true,
      });
      const filter: Filter<Subscription> = {
        where: {
          and: [{calendarId: calendarId}, {isPrimary: true}],
        },
      };
      const findOne = subscriptionRepo.stubs.findOne;
      findOne.resolves(subscription);
      const result = await calendarEventService.primarySubscription(calendarId);
      expect(result).to.eql(subscription);
      sinon.assert.calledOnce(findOne);
      sinon.assert.calledWith(findOne, filter);
    });
  });

  describe('gives whereClause according to timeMin and timeMax', () => {
    it('gives where Clause if both timeMin and timeMax are passed', () => {
      const timeMin = new Date(2020, 6, 1);
      const timeMax = new Date(2019, 6, 1);
      const whereClause = {
        or: [
          {startDateTime: {between: [timeMin, timeMax]}},
          {endDateTime: {between: [timeMin, timeMax]}},
          {
            and: [
              {startDateTime: {lte: timeMin}},
              {endDateTime: {gte: timeMax}},
            ],
          },
        ],
      };
      const result = calendarEventService.getWhereClause(timeMin, timeMax);
      expect(result).to.eql(whereClause);
    });

    it('gives where Clause if only timeMin is passed', () => {
      const timeMin = new Date(2020, 6, 1);
      const whereClause = {endDateTime: {gte: timeMin}};
      const result = calendarEventService.getWhereClause(timeMin);
      expect(result).to.eql(whereClause);
    });

    it('gives where Clause if only timeMax is passed', () => {
      const timeMax = new Date(2019, 6, 1);
      const whereClause = {startDateTime: {lte: timeMax}};
      const result = calendarEventService.getWhereClause(undefined, timeMax);
      expect(result).to.eql(whereClause);
    });
  });

  describe('returns a filter', () => {
    it('gives filter When filter Object is passed', () => {
      const timeMax = new Date(2019, 6, 1);
      const whereClause = {startDateTime: {lte: timeMax}};
      const identifier = 'dummy';
      const filter: Filter<EventAttendeeView> = {};
      filter.where = {isOptional: true};
      const result = calendarEventService.getFilter(
        identifier,
        whereClause,
        filter,
      );
      expect(result).to.have.property('where');
    });

    it('gives a differnet filter When filter Object is NOT passed', () => {
      const timeMax = new Date(2019, 6, 1);
      const whereClause = {startDateTime: {lte: timeMax}};
      const identifier = 'dummy';
      const result = calendarEventService.getFilter(identifier, whereClause);
      expect(result).to.have.property('where');
    });
  });

  function setUp() {
    subscriptionRepo = createStubInstance(SubscriptionRepository);
    calendarEventService = new CalendarEventService(subscriptionRepo);
  }
});

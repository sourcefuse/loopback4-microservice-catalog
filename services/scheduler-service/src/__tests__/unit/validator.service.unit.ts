import {ValidatorService} from '../../services';
import {
  CalendarRepository,
  SubscriptionRepository,
  EventRepository,
} from '../../repositories';
import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
  sinon,
} from '@loopback/testlab';
import {IAuthUserWithPermissions} from '@sourceloop/core';

import {
  Calendar,
  CalendarWithRelations,
  Event,
  Subscription,
} from '../../models';
import {Filter} from '@loopback/repository';
import {IdentifierType} from '../../models/enums/identifier-type.enum';

describe('Validator Service', () => {
  let calendarRepo: StubbedInstanceWithSinonAccessor<CalendarRepository>;
  let eventRepo: StubbedInstanceWithSinonAccessor<EventRepository>;
  let subscriptionRepo: StubbedInstanceWithSinonAccessor<SubscriptionRepository>;
  let currentUser: IAuthUserWithPermissions;
  let validatorService: ValidatorService;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('checks if the calendar exists or not ', () => {
    it('returns true if calendar exists', async () => {
      const calendar = new Calendar({
        id: 'test',
      });

      const calendarId = 'dummy';
      const filter: Filter<Calendar> = {where: {id: calendarId}};
      const findOne = calendarRepo.stubs.findOne;
      findOne.resolves(calendar as CalendarWithRelations);
      const result = await validatorService.calendarExists(calendarId);
      expect(result).to.eql(true);
      sinon.assert.calledOnce(findOne);
      sinon.assert.calledWith(findOne, filter);
    });

    it('returns false if calendar does not exist', async () => {
      const calendarId = 'dummy';
      const filter: Filter<Calendar> = {where: {id: calendarId}};
      const findOne = calendarRepo.stubs.findOne;
      findOne.resolves(null);
      const result = await validatorService.calendarExists(calendarId);
      expect(result).to.eql(false);
      sinon.assert.calledOnce(findOne);
      sinon.assert.calledWith(findOne, filter);
    });
  });

  describe('checks if the event exists or not ', () => {
    it('returns true if event exists', async () => {
      const event = new Event({
        id: 'test',
      });

      const eventId = 'dummy';
      const filter: Filter<Event> = {where: {id: eventId}};
      const findOne = eventRepo.stubs.findOne;
      findOne.resolves(event);
      const result = await validatorService.eventExists(eventId);
      expect(result).to.eql(true);
      sinon.assert.calledOnce(findOne);
      sinon.assert.calledWith(findOne, filter);
    });

    it('returns false if event does not exist', async () => {
      const eventId = 'dummy';
      const filter: Filter<Event> = {where: {id: eventId}};
      const findOne = eventRepo.stubs.findOne;
      findOne.resolves(null);
      const result = await validatorService.eventExists(eventId);
      expect(result).to.eql(false);
      sinon.assert.calledOnce(findOne);
      sinon.assert.calledWith(findOne, filter);
    });
  });

  describe('converts "primary" to the calendaId of the current User', () => {
    it('simply returns the calendarId if id is not equal to "primary"', async () => {
      const id = 'a-calendarId';
      const result = await validatorService.primaryToCalendarId(id);
      expect(result).to.eql(id);
    });

    it('returns primary calendarId of the user when id equals "primary"', async () => {
      const id = 'primary';
      const subscription = new Subscription({
        id: 'dummy',
        calendarId: 'dummy',
      });
      const filter: Filter<Subscription> = {
        where: {
          and: [
            {identifier: currentUser[IdentifierType.Id]},
            {isPrimary: true},
          ],
        },
      };
      const findOne = subscriptionRepo.stubs.findOne;
      findOne.resolves(subscription);
      const result = await validatorService.primaryToCalendarId(id);
      expect(result).to.eql(subscription.calendarId);
      sinon.assert.calledOnce(findOne);
      sinon.assert.calledWith(findOne, filter);
    });

    it('returns null when no calendarId exists when id equals "primary"', async () => {
      const id = 'primary';
      const filter: Filter<Subscription> = {
        where: {
          and: [
            {identifier: currentUser[IdentifierType.Id]},
            {isPrimary: true},
          ],
        },
      };
      const findOne = subscriptionRepo.stubs.findOne;
      findOne.resolves(null);
      const result = await validatorService.primaryToCalendarId(id);
      expect(result).to.eql(null);
      sinon.assert.calledOnce(findOne);
      sinon.assert.calledWith(findOne, filter);
    });
  });

  describe('checks if min max time are valid or not ', () => {
    it('returns false if timeMin is greater than timeMax', () => {
      const timeMin = new Date(2020, 6, 1);
      const timeMax = new Date(2019, 6, 1);
      const result = validatorService.minMaxTime(timeMin, timeMax);
      expect(result).to.eql(false);
    });

    it('returns true if valid', () => {
      const timeMin = new Date(2020, 6, 1);
      const result = validatorService.minMaxTime(timeMin);
      expect(result).to.eql(true);
    });
  });

  function setUp() {
    calendarRepo = createStubInstance(CalendarRepository);
    eventRepo = createStubInstance(EventRepository);
    subscriptionRepo = createStubInstance(SubscriptionRepository);
    currentUser = {
      id: 'dummy',
      email: 'dummy',
      permissions: ['dummy'],
      authClientId: 1,
      firstName: 'dummy',
      lastName: 'dummy',
      username: 'dummy',
      role: 'dummy',
    };

    validatorService = new ValidatorService(
      calendarRepo,
      eventRepo,
      subscriptionRepo,
      currentUser,
    );
  }
});

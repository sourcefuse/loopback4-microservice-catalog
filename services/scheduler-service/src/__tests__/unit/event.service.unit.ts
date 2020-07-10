import {EventService} from '../../services';
import {EventAttendeeViewRepository} from '../../repositories';
import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  sinon,
  expect,
} from '@loopback/testlab';
import {EventAttendeeView} from '../../models/event-attendee-view.model';
import {EventAttendeeViewItemDTO} from '../../models/event-attendee-view-item.dto';

describe('Event Service', () => {
  let eventAttendeeViewRepository: StubbedInstanceWithSinonAccessor<EventAttendeeViewRepository>;
  let eventService: EventService;
  const startTime = new Date('2020-06-21T11:30:00+05:30');
  const endTime = new Date('2020-06-21T12:30:00+05:30');
  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('limit Time To Boundary Values', () => {
    it('returns time object with boundary values', async () => {
      const timesObj = [
        {
          startDateTime: new Date('2020-06-21T11:00:00+05:30'),
          endDateTime: new Date('2020-06-21T13:00:00+05:30'),
        },
      ];

      const result = await eventService.limitTimeToBoundaryValues(
        timesObj,
        startTime,
        endTime,
      );
      expect(result[0]).to.have.properties(['startDateTime']);
      expect(result[0].startDateTime).to.eql(
        new Date('2020-06-21T06:00:00.000Z'),
      );
    });

    it('when startDateTime > startTime ', async () => {
      const timesObj = [
        {
          startDateTime: new Date('2020-06-21T13:01:00+05:30'),
          endDateTime: new Date('2020-06-21T13:03:00+05:30'),
        },
      ];

      const result = await eventService.limitTimeToBoundaryValues(
        timesObj,
        startTime,
        endTime,
      );
      expect(result[0]).to.have.properties(['startDateTime']);
      expect(result[0].startDateTime).to.eql(
        new Date('2020-06-21T07:31:00.000Z'),
      );
    });

    it('when endDateTime < endTime ', async () => {
      const timesObj = [
        {
          startDateTime: new Date('2020-06-21T13:02:00+05:30'),
          endDateTime: new Date('2020-06-21T12:00:00+05:30'),
        },
      ];

      const result = await eventService.limitTimeToBoundaryValues(
        timesObj,
        startTime,
        endTime,
      );
      expect(result[0]).to.have.properties(['startDateTime']);
      expect(result[0].startDateTime).to.eql(
        new Date('2020-06-21T07:32:00.000Z'),
      );
    });
  });

  describe('get busy details', () => {
    it('returns busy details obejct', async () => {
      const item = new EventAttendeeViewItemDTO();
      item.id = 'test@gmail.com';
      item.extId = 'testExt';
      const timeMin = new Date('2020-06-21T12:00:00+05:30');
      const timeMax = new Date('2020-06-21T14:00:00+05:30');
      const eventAttendeeResponse = [
        {
          startDateTime: new Date('2020-06-21T12:31:00+05:30'),
          endDateTime: new Date('2020-06-21T14:00:00+05:30'),
        },
      ];

      const find = eventAttendeeViewRepository.stubs.find;
      find.resolves(eventAttendeeResponse as EventAttendeeView[]);
      const result = await eventService.getBusyDetails(item, timeMax, timeMin);
      expect(result).to.have.properties(['busy']);
    });
  });

  describe('validate date', () => {
    it('return false when inncorrect date is passed', async () => {
      const date = new Date('2020-06-21T12:00:0005:30');
      const result = eventService.validateDateForTimeZone(date);
      expect(result).to.eql(false);
    });
  });

  function setUp() {
    eventAttendeeViewRepository = createStubInstance(
      EventAttendeeViewRepository,
    );

    eventService = new EventService(eventAttendeeViewRepository);
  }
});

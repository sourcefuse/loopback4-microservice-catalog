import {bind, BindingScope} from '@loopback/core';
import {repository, Filter} from '@loopback/repository';
import {ResponseStatusType} from '../models/enums/response-status.enum';
import {IStartEndTime, EventAttendeeView} from '../models';
import {EventAttendeeViewRepository} from '../repositories/event-attendee-view.repository';
import {EventAttendeeViewItemDTO} from '../models/event-attendee-view-item.dto';
import {HttpErrors} from '@loopback/rest';
import {ErrorKeys, StatusType} from '../models/enums';

@bind({scope: BindingScope.TRANSIENT})
export class EventService {
  constructor(
    @repository(EventAttendeeViewRepository)
    public eventAttendeeViewRepository: EventAttendeeViewRepository,
  ) {}

  async getBusyDetails(
    item: EventAttendeeViewItemDTO,
    timeMax: Date,
    timeMin: Date,
  ) {
    const where = [];
    where.push({
      status: {neq: StatusType.Cancelled},
    });
    where.push({
      or: [
        {responseStatus: {neq: ResponseStatusType.Declined}},
        {responseStatus: null as unknown as ResponseStatusType},
      ],
    });
    where.push({
      and: [{startDateTime: {lt: timeMax}}, {endDateTime: {gt: timeMin}}],
    });
    where.push({
      or: [
        {
          and: [
            {identifier: item.id},
            {attendeeIdentifier: null as unknown as string},
          ],
        },
        {attendeeIdentifier: item.id},
      ],
    });

    let key: keyof EventAttendeeViewItemDTO;
    for (key in item) {
      if (key !== 'id') {
        where.push({[key]: item[key]});
      }
    }

    const eventAttendeeFilter = {
      where: {
        and: where,
      },
    };
    let eventAttendeeResponse;
    try {
      eventAttendeeResponse = await this.eventAttendeeViewRepository.find(
        eventAttendeeFilter as Filter<EventAttendeeView>,
      );
    } catch (e) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.ItemInvalid);
    }

    const timesObj: IStartEndTime[] = [];
    const timesObj2 = Object.assign(timesObj, eventAttendeeResponse);

    const eventAttendeeList = await this.limitTimeToBoundaryValues(
      timesObj2,
      timeMin,
      timeMax,
    );

    let busyDetails: IStartEndTime[] = [];
    busyDetails = this.addToBusyArray(busyDetails, eventAttendeeList);

    return {
      busy: busyDetails,
    };
  }

  validateDateForTimeZone(date: Date): boolean {
    if (new Date(date).getTime() > 0) {
      const dateInString = date.toString().toLowerCase();
      if (dateInString.includes('+') || dateInString.includes('z')) {
        return true;
      }
    }
    return false;
  }

  addToBusyArray(
    busy: IStartEndTime[],
    entityList: IStartEndTime[],
  ): IStartEndTime[] {
    for (const entity of entityList) {
      const {startDateTime, endDateTime} = entity;
      if (startDateTime && endDateTime) {
        const startEndTime: IStartEndTime = {
          startDateTime,
          endDateTime,
        };
        busy.push(startEndTime);
      }
    }
    return busy;
  }

  async limitTimeToBoundaryValues(
    timesObj: IStartEndTime[],
    startTime: Date,
    endTime: Date,
  ): Promise<IStartEndTime[]> {
    timesObj.forEach(function (times) {
      const {startDateTime, endDateTime} = times;
      if (startDateTime && endDateTime) {
        if (startDateTime < new Date(startTime)) {
          times.startDateTime = new Date(startTime);
        }
        if (endDateTime > new Date(endTime)) {
          times.endDateTime = new Date(endTime);
        }
      }
    });
    return timesObj;
  }
}

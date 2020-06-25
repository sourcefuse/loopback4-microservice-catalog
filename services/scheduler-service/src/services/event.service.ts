import {bind, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ResponseStatusType} from '../models/enums/response-status.enum';
import {IStartEndTime} from '../models';
import {EventAttendeeViewRepository} from '../repositories/event-attendee-view.repository';

@bind({scope: BindingScope.TRANSIENT})
export class EventService {
  constructor(
    @repository(EventAttendeeViewRepository)
    public eventAttendeeViewRepository: EventAttendeeViewRepository,
  ) {}

  async getBusyDetails(id: string, timeMax: Date, timeMin: Date) {
    const eventAttendeeFilter = {
      where: {
        and: [
          {
            or: [
              {
                and: [
                  {identifier: id},
                  {attendeeIdentifier: (null as unknown) as string},
                ],
              },
              {attendeeIdentifier: id},
            ],
          },
          {responseStatus: {neq: ResponseStatusType.Declined}},
          {and: [{startDateTime: {lt: timeMax}}, {endDateTime: {gt: timeMin}}]},
        ],
      },
    };

    const eventAttendeeResponse = await this.eventAttendeeViewRepository.find(
      eventAttendeeFilter,
    );

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

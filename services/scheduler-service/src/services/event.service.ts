import {bind, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import { ResponseStatusType } from '../models/enums/response-status.enum';
import { StartEndTimeDTO } from '../models/start-end-time.dto';
import { Event } from '../models';
import { EventAttendeeViewRepository } from '../repositories/event-attendee-view.repository';

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
          {or: [
            {and: [{identifier: id}, {attendeeIdentifier: null as unknown as string}]}, 
            {attendeeIdentifier: id}
          ]},
          {responseStatus: {neq: ResponseStatusType.Declined}},
          {and: [
            {startDateTime: {lt: timeMax}},
            {endDateTime: {gt: timeMin}}
          ]},
        ]
      },
    };

    const eventAttendeeResponse = await this.eventAttendeeViewRepository.find(eventAttendeeFilter);

    const eventAttendeeList = this.limitTimeToBoundaryValues(
      eventAttendeeResponse,
      timeMin,
      timeMax,
    );

    let busyDetails: StartEndTimeDTO[] = [];
    // busyDetails = this.addToBusyArray(busyDetails, finalAttendeesList);
    // busyDetails = this.addToBusyArray(busyDetails, finalEventsList);
    busyDetails = this.addToBusyArray(busyDetails, eventAttendeeList);

    const busyDetailObj = {
      busy: busyDetails,
    };

    return busyDetailObj;
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
    busy: StartEndTimeDTO[],
    entityList: Event[],
  ): StartEndTimeDTO[] {
    for (const entity of entityList) {
      if (entity.startDateTime && entity.endDateTime) {
        const startEndTime = new StartEndTimeDTO();
        startEndTime.startDateTime = entity.startDateTime;
        startEndTime.endDateTime = entity.endDateTime;
        busy.push(startEndTime);
      }
    }
    return busy;
  }

  limitTimeToBoundaryValues(
    timesObj:  Event[],
    startTime: Date,
    endTime: Date,
  ): Event[] {
    for (const times in timesObj) {
      if (timesObj[times].startDateTime) {
        const startDateTime = timesObj[times].startDateTime;
        const endDateTime = timesObj[times].endDateTime;
        if (startDateTime && startDateTime < new Date(startTime)) {
          timesObj[times].startDateTime = new Date(startTime);
        }
        if (endDateTime && endDateTime > new Date(endTime)) {
          timesObj[times].endDateTime = new Date(endTime);
        }
      }
    }
    return timesObj;
  }
}

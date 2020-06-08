import {belongsTo, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourcefuse-service-catalog/core';
import {Calendar, CalendarWithRelations} from './calendar.model';
import {DayOfWeekType} from './enums/day-of-week.enum';

@model({
  name: 'working_hours',
})
export class WorkingHour extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'number',
    name: 'day_of_week',
    jsonSchema: {
      enum: [
        DayOfWeekType.Monday,
        DayOfWeekType.Tuesday,
        DayOfWeekType.Wednesday,
        DayOfWeekType.Thursday,
        DayOfWeekType.Friday,
        DayOfWeekType.Saturday,
        DayOfWeekType.Sunday,
        null,
      ],
      nullable: true,
    },
  })
  dayOfWeek?: DayOfWeekType;

  @property({
    type: 'string',
  })
  end?: string;

  @property({
    type: 'string',
  })
  start?: string;

  @belongsTo(
    () => Calendar,
    {keyFrom: 'calendarId', name: 'calendar'},
    {
      name: 'calendar_id',
      required: true,
    },
  )
  calendarId: string;

  constructor(data?: Partial<WorkingHour>) {
    super(data);
  }
}

export interface WorkingHourRelations {
  // describe navigational properties here
  calendar: CalendarWithRelations;
}

export type WorkingHourWithRelations = WorkingHour & WorkingHourRelations;

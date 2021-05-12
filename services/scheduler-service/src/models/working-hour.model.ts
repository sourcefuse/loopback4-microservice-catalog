import {AnyObject, belongsTo, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {Calendar} from './calendar.model';
import {DayOfWeekType} from './enums/day-of-week.enum';

@model({
  name: 'working_hours',
})
export class WorkingHour
  extends UserModifiableEntity
  implements ExternalIdentifierEnabledEntity
{
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
      ],
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

  @property({
    type: 'string',
    name: 'ext_id',
  })
  extId?: string;

  @property({
    type: 'object',
    name: 'ext_metadata',
  })
  extMetadata?: AnyObject;

  constructor(data?: Partial<WorkingHour>) {
    super(data);
  }
}

export interface WorkingHourRelations {
  calendar?: Calendar;
}

export type WorkingHourWithRelations = WorkingHour & WorkingHourRelations;

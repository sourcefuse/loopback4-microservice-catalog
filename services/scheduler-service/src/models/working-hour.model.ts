import {belongsTo, model, property} from '@loopback/repository';
import {Calendar, CalendarWithRelations} from './calendar.model';
import {DayOfWeekType} from './enums/day-of-week.enum';
import {UserModifiableEntity} from './user-modifiable-entity.model';

@model({
  name: 'working_hour',
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
      enum: [0, 1, 2, 3, 4, 5, 6, null],
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

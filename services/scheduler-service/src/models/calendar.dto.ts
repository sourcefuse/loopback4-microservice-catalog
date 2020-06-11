import {model, property} from '@loopback/repository';
import {Calendar} from './calendar.model';
import {WorkingHour} from './working-hour.model';

@model()
export class CalendarDTO extends Calendar {
  @property.array(WorkingHour)
  workingHours: WorkingHour[];

  constructor(data?: Partial<CalendarDTO>) {
    super(data);
  }
}

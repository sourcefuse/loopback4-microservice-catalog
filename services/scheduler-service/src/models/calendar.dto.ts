import {AnyObject, model, Model, property} from '@loopback/repository';
import {Subscription} from './subscription.model';
import {WorkingHour} from './working-hour.model';

@model()
export class CalendarDTO extends Model {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  source?: string;

  @property({
    type: 'boolean',
    default: false,
    name: 'enable_working_hours',
  })
  enableWorkingHours?: boolean;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 300,
    },
  })
  location?: string;

  @property({
    type: 'string',
    required: true,
    name: 'identifier',
    jsonSchema: {
      maxLength: 200,
    },
  })
  identifier: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 100,
    },
  })
  summary?: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 120,
    },
  })
  timezone?: string;

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

  @property.array(WorkingHour)
  workingHours?: WorkingHour[];

  @property({
    type: 'object',
  })
  subscription?: Subscription;

  constructor(data?: Partial<CalendarDTO>) {
    super(data);
  }
}

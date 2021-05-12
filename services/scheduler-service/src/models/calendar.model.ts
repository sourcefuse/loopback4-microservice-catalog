import {AnyObject, hasMany, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {Event} from './event.model';
import {Subscription} from './subscription.model';
import {WorkingHour} from './working-hour.model';

@model({
  name: 'calendars',
})
export class Calendar
  extends UserModifiableEntity
  implements ExternalIdentifierEnabledEntity
{
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

  @hasMany(() => Event, {name: 'events', keyTo: 'calendarId'})
  events: Event[];

  @hasMany(() => WorkingHour, {name: 'workingHours', keyTo: 'calendarId'})
  workingHours: WorkingHour[];

  @hasMany(() => Subscription, {name: 'subscriptions', keyTo: 'calendarId'})
  subscriptions: Subscription[];

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

  constructor(data?: Partial<Calendar>) {
    super(data);
  }
}

export interface CalendarRelations {
  event?: Event;
  subscriptions?: Subscription;
  workingHours?: WorkingHour;
}

export type CalendarWithRelations = Calendar & CalendarRelations;

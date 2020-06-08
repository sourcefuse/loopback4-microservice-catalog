import {hasMany, model, property} from '@loopback/repository';
import { UserModifiableEntity, ExternalIdentifierEnabledEntity } from '@sourcefuse-service-catalog/core';
import {Event} from './event.model';
import {Subscription} from './subscription.model';
import {WorkingHour} from './working-hour.model';

@model({
  name: 'calendars',
})
export class Calendar extends UserModifiableEntity implements ExternalIdentifierEnabledEntity {
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
  })
  location?: string;

  @property({
    type: 'string',
    name: 'owner_display_name',
  })
  ownerDisplayName?: string;

  @property({
    type: 'string',
    required: true,
    name: 'owner_email',
  })
  ownerEmail: string;

  @property({
    type: 'string',
  })
  summary?: string;

  @property({
    type: 'string',
  })
  timezone?: string;

  @hasMany(() => Event, {name: 'events'})
  events: Event[];

  @hasMany(() => WorkingHour, {name: 'workingHours'})
  workingHours: WorkingHour[];

  @hasMany(() => Subscription, {name: 'subscriptions'})
  subscriptions: Subscription[];

  @property({
    type: 'string',
    name: 'ext_id',
  })
  extId: string;

  @property({
    type: 'object',
    name: 'ext_meadata',
  })
  extMetadata: object;

  constructor(data?: Partial<Calendar>) {
    super(data);
  }
}

export interface CalendarRelations {
  // describe navigational properties here
  subscriptions?: Subscription[];
  workingHours?: WorkingHour[];
}

export type CalendarWithRelations = Calendar & CalendarRelations;

import {AnyObject, belongsTo, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {Calendar, CalendarWithRelations} from './calendar.model';
import {AccessRoleType} from './enums/access-role.enum';

@model({
  name: 'subscriptions',
})
export class Subscription
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
    default: AccessRoleType.Reader,
    name: 'access_role',
    jsonSchema: {
      enum: [
        AccessRoleType.FreeBusyReader,
        AccessRoleType.Reader,
        AccessRoleType.Writer,
        AccessRoleType.Owner,
      ],
    },
  })
  accessRole?: AccessRoleType;

  @property({
    type: 'string',
    name: 'bg_color',
  })
  bgColor?: string;

  @property({
    type: 'string',
    name: 'fg_color',
  })
  fgColor?: string;

  @property({
    type: 'boolean',
    default: false,
    name: 'is_hidden',
  })
  isHidden?: boolean;

  @property({
    type: 'boolean',
    default: false,
    name: 'is_primary',
  })
  isPrimary?: boolean;

  @property({
    type: 'string',
    required: true,
    name: 'identifier',
  })
  identifier: string;

  @property({
    type: 'object',
    name: 'default_reminders',
  })
  defaultReminders?: object;

  @property({
    type: 'object',
    name: 'notification_settings',
  })
  notificationSettings?: object;

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

  constructor(data?: Partial<Subscription>) {
    super(data);
  }
}

export interface SubscriptionRelations {
  calendar?: CalendarWithRelations;
}

export type SubscriptionWithRelations = Subscription & SubscriptionRelations;

import {AnyObject, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {OwnerType} from './enums/owner-type.enum';

@model({
  name: 'settings',
})
export class Settings
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
    required: true,
    name: 'owner_id',
    jsonSchema: {
      maxLength: 225,
    },
  })
  ownerId: string;

  @property({
    type: 'string',
    default: OwnerType.Global,
    name: 'owner_type',
    jsonSchema: {
      enum: [
        OwnerType.Global,
        OwnerType.User,
        OwnerType.Calendar,
        OwnerType.Event,
      ],
    },
  })
  ownerType?: OwnerType;

  @property({
    type: 'string',
    name: 'setting_name',
    jsonSchema: {
      maxLength: 225,
    },
  })
  settingName?: string;

  @property({
    type: 'string',
    name: 'setting_value',
    jsonSchema: {
      maxLength: 1500,
    },
  })
  settingValue?: string;

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

  constructor(data?: Partial<Settings>) {
    super(data);
  }
}

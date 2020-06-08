import {model, property} from '@loopback/repository';
import {OwnerType} from './enums/owner-type.enum';
import {UserModifiableEntity} from '@sourcefuse-service-catalog/core';

@model({
  name: 'settings',
})
export class Settings extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'owner_id',
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
        null,
      ],
      nullable: true,
    },
  })
  ownerType?: OwnerType;

  @property({
    type: 'string',
    name: 'setting_name',
  })
  settingName?: string;

  @property({
    type: 'string',
    name: 'setting_value',
  })
  settingValue?: string;

  constructor(data?: Partial<Settings>) {
    super(data);
  }
}

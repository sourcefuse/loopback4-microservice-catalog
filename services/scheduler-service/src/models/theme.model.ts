import {AnyObject, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';

@model({
  name: 'themes',
})
export class Theme
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
    name: 'cal_bg',
    jsonSchema: {
      maxLength: 200,
    },
  })
  calBg?: string;

  @property({
    type: 'string',
    name: 'cal_fg',
    jsonSchema: {
      maxLength: 200,
    },
  })
  calFg?: string;

  @property({
    type: 'string',
    name: 'event_bg',
    jsonSchema: {
      maxLength: 200,
    },
  })
  eventBg?: string;

  @property({
    type: 'string',
    name: 'event_fg',
    jsonSchema: {
      maxLength: 200,
    },
  })
  eventFg?: string;

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

  constructor(data?: Partial<Theme>) {
    super(data);
  }
}

import {model, property} from '@loopback/repository';
import { UserModifiableEntity, ExternalIdentifierEnabledEntity } from '@sourcefuse-service-catalog/core';

@model({
  name: 'themes',
})
export class Theme extends UserModifiableEntity implements ExternalIdentifierEnabledEntity{
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'cal_bg',
  })
  calBg?: string;

  @property({
    type: 'string',
    name: 'cal_fg',
  })
  calFg?: string;

  @property({
    type: 'string',
    name: 'event_bg',
  })
  eventBg?: string;

  @property({
    type: 'string',
    name: 'event_fg',
  })
  eventFg?: string;

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

  constructor(data?: Partial<Theme>) {
    super(data);
  }
}

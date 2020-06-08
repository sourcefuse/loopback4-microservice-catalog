import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourcefuse-service-catalog/core';

@model({
  name: 'themes',
})
export class Theme extends UserModifiableEntity {
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

  constructor(data?: Partial<Theme>) {
    super(data);
  }
}

export interface ThemeRelations {
  // describe navigational properties here
}

export type ThemeWithRelations = Theme & ThemeRelations;

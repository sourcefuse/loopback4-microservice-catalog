﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {property, Model, model} from '@loopback/repository';
import {EventAttendeeViewItemDTO} from './event-attendee-view-item.dto';

@model()
export class FreeBusyDTO extends Model {
  @property({
    type: 'date',
    required: true,
  })
  timeMax: Date;

  @property({
    type: 'date',
    required: true,
  })
  timeMin: Date;

  @property.array(EventAttendeeViewItemDTO)
  items: EventAttendeeViewItemDTO[];
}

export interface IStartEndTime {
  startDateTime: Date;
  endDateTime: Date;
}

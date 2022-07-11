// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {Group} from './group.model';
@model({
  name: 'v_group_user_count',
  settings: {
    defaultIdSort: false,
  },
})
export class GroupUserCountView extends Group {
  @property({
    name: 'user_count',
    type: 'number',
    default: 0,
  })
  userCount?: number;

  constructor(data?: Partial<GroupUserCountView>) {
    super(data);
  }
}

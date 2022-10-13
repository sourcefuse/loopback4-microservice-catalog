// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Group} from '../../../models';
import {PartyTypeMarker} from '../../../types';

export const group = new Group({
  id: 'random-group-id',
  party: 'sample-party@example.com',
  messageId: 'sample-message-id',
  threadId: 'sample-thread-id',
  type: PartyTypeMarker.from,
});

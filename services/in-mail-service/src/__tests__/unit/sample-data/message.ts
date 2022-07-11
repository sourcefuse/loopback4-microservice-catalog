// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Message} from '../../../models';

export const message = new Message({
  id: 'random-message-id',
  body: 'random-body',
  sender: 'bhavya.dhiman@sourcefuse.com',
  subject: 'Sample Subject',
  status: 'draft',
  extId: '123455533',
  extMetadata: {
    gmail: {},
  },
  attachments: [],
  group: [],
  meta: [],
  threadId: '12344343',
});

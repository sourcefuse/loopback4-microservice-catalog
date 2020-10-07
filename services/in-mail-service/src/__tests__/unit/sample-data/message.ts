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

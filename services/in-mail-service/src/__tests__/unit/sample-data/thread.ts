import {Group, Thread} from '../../../models';

export const thread = new Thread({
  id: 'random-thread-id',
  messageCounts: 4,
  subject: 'Sample Subject',
  groups: [
    new Group({
      id: 'random-group-id',
      party: 'sample-party@example.com',
      messageId: 'sample-message-id',
      threadId: 'sample-thread-id',
    }),
  ],
});

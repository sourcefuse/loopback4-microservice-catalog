import {Group} from '../../../models';
import {PartyTypeMarker} from '../../../types';

export const group = new Group({
  id: 'random-group-id',
  party: 'sample-party@example.com',
  messageId: 'sample-message-id',
  threadId: 'sample-thread-id',
  type: PartyTypeMarker.from,
});

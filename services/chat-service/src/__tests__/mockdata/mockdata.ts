import {AttachmentFile} from '../../models/attachment-file.model';
export const dataMessageFile = new AttachmentFile({
  channelId: 'C1',
  fileKey: 'FK',
  metaData: {
    foo: 'bar',
  },
});

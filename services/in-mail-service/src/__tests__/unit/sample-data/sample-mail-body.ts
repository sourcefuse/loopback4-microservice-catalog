import {ComposeMailBody} from '../../../types';

export const getSampleMailData = {
  groups: [
    {
      party: 'example@message.com',
      type: 'to',
    },
  ],
  attachments: [
    {
      name: 'Sample Attachment',
      mime: 'image/jpg',
      path: 'original.s3.amazonaws.com/',
      thumbnail: 'compressed.s3.amazonaws.com',
    },
  ],
  body: 'Sample Message body!',
  subject: 'MessageId',
  extId: 'random-id',
  extMetadata: {
    x: 'y',
    y: 'z',
  },
  meta: [
    {
      key: 'Content-Type',
      value: 'image/jpeg',
    },
  ],
  status: 'draft',
} as ComposeMailBody;

export const getSampleDataWithOutGroup = {
  groups: [],
  body: 'Sample Message Body',
  subject: 'Sample Subject',
  extId: 'random-id',
  extMetadata: {
    x: 'y',
    y: 'z',
  },
} as unknown as ComposeMailBody;

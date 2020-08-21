import {IAuthUserWithPermissions} from '@sourceloop/core';
import {ComposeMailBody} from '../../types';
const getSampleUser = () => {
  return {
    firstName: 'sample',
    lastName: 'user',
    email: 'sample.user@example.com',
    id: 'unique-user-id',
    authClientId: 1,
    role: 'any-random-role',
  } as IAuthUserWithPermissions;
};

const getSampleMailData = () => {
  return {
    body: 'Sample Body',
    subject: 'Sample Subject',
    groups: [
      {
        type: 'to',
        party: 'receipient-one@example.com',
      },
      {
        type: 'cc',
        party: 'recipient-two@example.com',
      },
      {
        type: 'bcc',
        party: 'recipient-three@example.com',
      },
    ],
    attachments: [
      {
        name: 'sample-file',
        path: 'sample-s3-url.amazonaws.com',
        thumbnail: 'compressed-sample-s3-url.amazonaws.com',
        mime: 'image/jpg',
      },
    ],
  } as ComposeMailBody;
};

export {getSampleUser, getSampleMailData};

import {CONTENT_TYPE} from '@sourceloop/core';

export const NOTIF_SVC_CONFIG = {
  name: 'NotificationService',
  connector: 'rest',
  baseURL: '',
  crud: false,
  options: {
    baseUrl: process.env.NOTIFICATION_SERVICE_URL,
    headers: {
      accept: CONTENT_TYPE.JSON,
      'content-type': CONTENT_TYPE.JSON,
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: '/notification-users/{id}/notification',
      },
      headers: {
        'content-type': CONTENT_TYPE.JSON,
      },
      functions: {
        getNotification: ['id'],
      },
    },
  ],
};

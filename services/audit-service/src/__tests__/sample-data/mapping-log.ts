import {MappingLog} from '../../models';
import {JSONObject} from '@loopback/core';

export const mappingLog: MappingLog = new MappingLog({
  id: '1',
  filterUsed: {
    date: {
      toDate: '2023-05-12T09:42:07.522Z',
      fromDate: '2023-05-01T09:42:07.522Z',
    },
    actedOn: 'Product',
    deleted: false,
  },
  fileName: 'alpha.csv',
});

export const listMappingLogs: MappingLog[] = [
  new MappingLog({
    filterUsed: {
      date: {
        toDate: '2023-05-12T09:42:07.521Z',
        fromDate: '2023-05-01T09:42:07.522Z',
      },
      actedOn: 'Product',
      deleted: false,
    } as JSONObject,
    fileName: 'archive1.csv',
  }),
  new MappingLog({
    filterUsed: {
      date: {
        toDate: '2023-05-12T09:42:07.523Z',
        fromDate: '2023-05-01T09:42:07.524Z',
      },
      actedOn: 'Product',
      deleted: true,
    } as JSONObject,
    fileName: 'archive2.csv',
  }),
];
export const uploaderResponse: AWS.S3.ManagedUpload.SendData = {
  Location: 'https://s3.example.com/archive-logs/filename',
  Bucket: 'archive-logs',
  Key: 'filename',
  ETag: 'abc123',
};

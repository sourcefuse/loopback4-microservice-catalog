import {AnyObject} from '@loopback/repository';
import {Attachment, Group, Meta} from '../models';
import {StorageMarker} from './storage-marker.type';

export type ComposeMailBody = {
  id?: string;
  groups: Partial<Group>[];
  subject: string;
  body: string;
  attachments: Partial<Attachment>[];
  meta: Partial<Meta>[];
  threadId?: string;
  status: StorageMarker.draft | StorageMarker.send;
  extId?: string;
  extMetadata?: AnyObject;
  isImportant?: boolean;
};

export type ForwardMailBody = {
  groups: Partial<Group>[];
  subject: string;
  body: string;
  attachments: Partial<Attachment>[];
  meta: Partial<Meta>[];
  status: StorageMarker.draft | StorageMarker.send;
};

import {Attachment, Meta, Group} from '../models';
import {AnyObject} from '@loopback/repository';
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
};

export type ForwardMailBody = {
  groups: Partial<Group>[];
  subject: string;
  body: string;
  attachments: Partial<Attachment>[];
  meta: Partial<Meta>[];
  status: StorageMarker.draft | StorageMarker.send;
};

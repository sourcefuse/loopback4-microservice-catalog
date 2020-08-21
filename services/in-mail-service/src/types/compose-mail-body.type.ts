import {Attachment, Meta, Group} from '../models';
import {AnyObject} from '@loopback/repository';

export type ComposeMailBody = {
  id?: string;
  groups: Partial<Group>[];
  subject: string;
  body: string;
  attachments: Partial<Attachment>[];
  meta: Partial<Meta>[];
  threadId?: string;
  status: 'draft' | 'send';
  extId?: string;
  extMetadata?: AnyObject;
};

export type ForwardMailBody = {
  groups: Partial<Group>[];
};

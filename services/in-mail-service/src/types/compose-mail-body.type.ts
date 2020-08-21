import {Attachment, Meta, Group} from '../models';
import {AnyObject} from '@loopback/repository';

export type ComposeMailBody = {
  id?: string;
  groups: Group[];
  subject: string;
  body: string;
  attachments: Attachment[];
  meta: Meta[];
  threadId?: string;
  status: 'draft' | 'send';
  extId?: string;
  extMetadata?: AnyObject;
};

export type ForwardMailBody = {
  groups: Group[];
};

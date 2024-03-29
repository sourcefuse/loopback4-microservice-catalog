﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Attachment} from '../../../models';

export const attachment = new Attachment({
  id: 'sample-attachment-id',
  path: 'sample-path-to-s3',
  thumbnail: 'sample-path-to-thumbnail',
  mime: 'image/jpeg',
  messageId: 'sample-message-id',
});

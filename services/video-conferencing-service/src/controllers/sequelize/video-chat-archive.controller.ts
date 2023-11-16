// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';

import {ServiceBindings} from '../../keys';

import {ChatArchiveService} from '../../services/sequelize/chat-archive.service';
import {VideoChatArchiveController as JugglerVideoChatArchiveController} from '../video-chat-archive.controller';
export class VideoChatArchiveController extends JugglerVideoChatArchiveController {
  constructor(
    @inject(ServiceBindings.ArchiveChatService)
    public chatArchiveService: ChatArchiveService,
  ) {
    super(chatArchiveService);
  }
}

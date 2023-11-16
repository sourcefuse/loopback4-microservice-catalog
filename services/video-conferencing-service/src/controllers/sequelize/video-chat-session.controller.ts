// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';

import {ServiceBindings} from '../../keys';
import {ChatSessionService} from '../../services/sequelize/chat-session.service';
import {VideoChatSessionController as JugglerVideoChatSessionController} from '../video-chat-session.controller';
export class VideoChatSessionController extends JugglerVideoChatSessionController {
  constructor(
    @inject(ServiceBindings.SessionChatService)
    public chatSessionService: ChatSessionService,
  ) {
    super(chatSessionService);
  }
}

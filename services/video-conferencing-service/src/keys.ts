﻿// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IArchiveService, ISessionService, VideoChatInterface} from './types';
import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX, IServiceConfig} from '@sourceloop/core';
import {MeetingLinkIdGenerator} from './services';

/**
 * @namespace VideoChatBindings
 * @const VideoChatProvider Main Parent Provider which binds @interface VideoChatInterface
 */
export namespace VideoChatBindings {
  export const VideoChatProvider = BindingKey.create<VideoChatInterface>(
    'sf.videochatprovider',
  );

  export const TwilioVideoChatProvider = BindingKey.create<VideoChatInterface>(
    'sf.twiliovideochatprovider',
  );
  export const Config = BindingKey.create<IServiceConfig | null>(
    `${BINDING_PREFIX}.videochat.config`,
  );
}
export namespace ServiceBindings {
  export const ArchiveChatService = BindingKey.create<IArchiveService>(
    'services.ChatArchiveService',
  );
  export const SessionChatService = BindingKey.create<ISessionService>(
    'services.ChatSessionService',
  );
}

export const MeetLinkGeneratorProvider =
  BindingKey.create<MeetingLinkIdGenerator>(
    'provider.MeetingLinkGeneratorProvider',
  );

export const VideoConfDatasource = 'videochatDb';

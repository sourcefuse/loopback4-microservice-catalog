// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export interface ChatMessage {
  id?: string;
  subject: string;
  body: string;
  toUserId?: string;
  channelId?: string;
  channelType?: string;
  reply: boolean;
  sender: string;
}

export interface Chat {
  id?: string;
  subject: string;
  body: string;
  toUserId: string;
  channelId: string;
  channelType: string;
  createdOn?: Date;
  createdBy?: string;
}

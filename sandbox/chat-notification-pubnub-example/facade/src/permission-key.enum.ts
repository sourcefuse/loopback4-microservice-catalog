// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export enum PermissionKey {
  ViewMessage = 'ViewMessage',
  CreateMessage = 'CreateMessage',
  UpdateMessage = 'UpdateMessage',
  DeleteMessage = 'DeleteMessage',

  CreateMessageRecipient = 'CreateMessageRecipient',
  ViewMessageRecipient = 'ViewMessageRecipient',
  UpdateMessageRecipient = 'UpdateMessageRecipient',
  DeleteMessageRecipient = 'DeleteMessageRecipient',

  ViewNotification = 'ViewNotification',
  CreateNotification = 'CreateNotification',
  UpdateNotification = 'UpdateNotification',
  DeleteNotification = 'DeleteNotification',
  CanGetNotificationAccess = 'CanGetNotificationAccess',

  ViewChannel = 'ViewChannel',
  CreateChannel = 'CreateChannel',
  UpdateChannel = 'UpdateChannel',
  DeleteChannel = 'DeleteChannel',
}

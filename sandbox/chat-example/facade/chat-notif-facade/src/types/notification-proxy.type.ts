import {NotificationDto, NotificationUserDto} from '../models';

export interface NotificationServiceProxy {
  getNotification(
    id: typeof NotificationUserDto.prototype.id,
  ): Promise<NotificationDto>;
}

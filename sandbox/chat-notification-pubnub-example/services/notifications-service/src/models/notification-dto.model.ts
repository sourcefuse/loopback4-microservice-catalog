import {Model, model, property} from '@loopback/repository';
import {Receiver, MessageOptions} from 'loopback4-notifications';
import {NotificationUser} from './notification-user.model';
@model()
export class NotificationDto extends Model {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;
  @property({
    type: 'string',
    jsonSchema: {
      nullable: true,
    },
  })
  subject?: string;
  @property({
    type: 'string',
    required: true,
  })
  body: string;
  @property({
    type: 'object',
    required: true,
  })
  receiver: Receiver;
  @property({
    type: 'number',
    required: true,
  })
  type: number;
  @property({
    type: 'date',
    name: 'sent',
  })
  sentDate: Date;
  @property({
    type: 'object',
  })
  options?: MessageOptions;
  @property.array(() => NotificationUser)
  notificationUsers?: NotificationUser[];
  constructor(data?: Partial<NotificationDto>) {
    super(data);
  }
}

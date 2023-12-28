import {Model, model, property} from '@loopback/repository';

@model()
export class NotificationSettingsDto extends Model {
  @property({
    type: 'array',
    itemType: 'string',
  })
  ids?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  userId?: string[];

  @property({
    type: 'date',
    required: false,
    name: 'start_time',
  })
  startTime?: Date;

  @property({
    type: 'date',
    required: false,
    name: 'end_time',
  })
  endTime?: Date;

  constructor(data?: Partial<NotificationSettingsDto>) {
    //Constructor for model NotificationSettingsDto
    super(data);
  }
}

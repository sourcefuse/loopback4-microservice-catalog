import {Model, model, property} from '@loopback/repository';

@model()
export class ResponderReminderDto extends Model {
  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  surveyResponderIds: string[];
}

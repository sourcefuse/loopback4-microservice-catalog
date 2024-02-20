import {model, property} from '@loopback/repository';

@model({
  description: 'This model represents a dashboard',
})
export class CreateDashboardDto {
  @property({
    type: 'string',
    required: true,
    description: 'The name of the dashboard',
  })
  name: string;

  @property({
    type: 'string',
    description: 'The description of the dashboard',
  })
  description?: string;

  @property({
    type: 'object',
    description: 'The layout of the dashboard',
  })
  layout?: Object;

  @property.array(String)
  widgetIds: string[];

  constructor(data?: Partial<CreateDashboardDto>) {
    Object.assign(this, data);
  }
}

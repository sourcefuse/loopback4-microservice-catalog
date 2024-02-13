import {Entity, model, property} from '@loopback/repository';

@model({name: 'dashboard_widgets'})
export class DashboardWidget extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    required: false,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    name: 'dashboard_id',
  })
  dashboardId: string;

  @property({
    type: 'string',
    required: true,
    name: 'widget_id',
  })
  widgetId: string;
}

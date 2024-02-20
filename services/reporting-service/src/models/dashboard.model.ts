import {AnyObject, hasMany, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {DashboardWidget} from './dashboard-widget.model';
import {Widget} from './widget.model';

@model({
  name: 'dashboards',
  description: 'This model represents a dashboard',
})
export class Dashboard
  extends UserModifiableEntity
  implements ExternalIdentifierEnabledEntity
{
  @property({
    type: 'string',
    id: true,
    generated: true,
    description: 'The unique identifier for a dashboard',
  })
  id: string;

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
  description: string;

  @hasMany(() => Widget, {
    through: {
      model: () => DashboardWidget,
      keyFrom: 'dashboardId',
      keyTo: 'widgetId',
    },
  })
  widgets: Widget[];

  @property({
    type: 'object',
    description: 'The layout of the dashboard',
  })
  layout: Object;

  @property({
    type: 'string',
    name: 'ext_id',
    description: 'The external id of the dashboard',
  })
  extId?: string;

  @property({
    type: 'object',
    name: 'ext_metadata',
    description: 'The external metadata of the dashboard',
  })
  extMetadata?: AnyObject;
}

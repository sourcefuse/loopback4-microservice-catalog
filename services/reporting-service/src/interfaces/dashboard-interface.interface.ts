import {WidgetInterface} from './widget-interface.interface';

export interface DashboardInterface {
  id: string;
  title: string;
  description: string;
  widgets: WidgetInterface[];
  layout: Object;
}

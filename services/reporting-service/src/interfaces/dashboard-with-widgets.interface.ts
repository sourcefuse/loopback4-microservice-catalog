import {Dashboard} from '../models/dashboard.model';

export interface DashboardWithWidgets extends Dashboard {
  widgetIds: string[];
}

export type ChartType = 'bar' | 'line';
export type NonChartType = 'pie' | 'table';

export interface WidgetInterface {
  id: string;
  type: ChartType | NonChartType;
  title: string;
  dataSetId: string;
}

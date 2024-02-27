export interface WidgetInterface {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'table';
  title: string;
  dataSetId: string;
}

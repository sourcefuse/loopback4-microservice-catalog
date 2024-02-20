/* The `export enum PermissionKeys {` statement is defining an enumeration in TypeScript. An
enumeration, or enum, is a way to define a set of named values. In this case, the enum is named
`PermissionKeys` and it contains a list of permission keys that can be used to represent different
permissions or access levels in an application. Each key is assigned a string value, such as
`'ViewDataSources'` or `'CreateDataSets'`. The `export` keyword makes the enum accessible outside of
the current module, allowing other modules to import and use it. */
export enum PermissionKeys {
  ViewDataSources = 'ViewDataSources',
  ViewDataSourcesColumns = 'ViewDataSourcesColumns',
  ViewDataSets = 'ViewDataSets',
  ViewDataSetsList = 'ViewDataSetsList',
  FetchDataFromDataSet = 'FetchDataFromDataSet',
  CreateDataSets = 'CreateDataSets',
  UpdateDataSets = 'UpdateDataSets',
  DeleteDataSets = 'DeleteDataSets',
  ViewIngestionMappings = 'ViewIngestionMappings',
  ViewIngestionMapping = 'ViewIngestionMapping',
  CreateIngestionMappings = 'CreateIngestionMappings',
  UpdateIngestionMappings = 'UpdateIngestionMappings',
  DeleteIngestionMappings = 'DeleteIngestionMappings',
  CreateDashboard = 'CreateDashboard',
  ViewDashboard = 'ViewDashboard',
  ViewDashboardList = 'ViewDashboardList',
  UpdateDashboard = 'UpdateDashboard',
  DeleteDashboard = 'DeleteDashboard',
  CreateWidget = 'CreateWidget',
  UpdateWidget = 'UpdateWidget',
  DeleteWidget = 'DeleteWidget',
  ViewWidget = 'ViewWidget',
  ViewWidgetList = 'ViewWidgetList',
}

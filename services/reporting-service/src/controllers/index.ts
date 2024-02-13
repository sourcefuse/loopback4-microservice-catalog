import {DashboardController} from './dashboard.controller';
import {DataSetsController} from './data-sets.controller';
import {DataSourcesController} from './data-sources.controller';
import {IngestionMappingsController} from './ingestion-mappings.controller';
import {StateTrackingController} from './state-tracking.controller';
import {WidgetController} from './widget.controller';

export * from './dashboard.controller';
export * from './data-sets.controller';
export * from './data-sources.controller';
export * from './ingestion-mappings.controller';
export * from './state-tracking.controller';
export * from './widget.controller';
export const controllers = [
  DataSourcesController,
  IngestionMappingsController,
  DataSetsController,
  StateTrackingController,
  WidgetController,
  DashboardController,
];

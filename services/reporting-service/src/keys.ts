import {BindingKey, CoreBindings} from '@loopback/core';
import {ReportingServiceComponent} from './component';

/**
 * Binding keys used by this component.
 */
export namespace ReportingServiceComponentBindings {
  export const COMPONENT = BindingKey.create<ReportingServiceComponent>(
    `${CoreBindings.COMPONENTS}.ReportingServiceComponent`,
  );
}

export const ReportingDatasourceName = 'reporting';

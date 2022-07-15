// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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

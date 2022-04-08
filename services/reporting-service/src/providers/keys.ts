import {BindingKey} from '@loopback/core';
import {IReporting} from './types';
export namespace ReportingBindings {
  export const ReportingHelper = BindingKey.create<IReporting | string | null>(
    'sf.reporting.helper',
  );
}

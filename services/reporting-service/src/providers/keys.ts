// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {IReporting} from './types';
export namespace ReportingBindings {
  export const ReportingHelper = BindingKey.create<IReporting | string | null>(
    'sf.reporting.helper',
  );
}

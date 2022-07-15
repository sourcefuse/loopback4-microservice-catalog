// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {MetabaseReports} from './types';

export namespace MetabaseBindings {
  export const MetabaseHelper = BindingKey.create<
    MetabaseReports | string | null
  >('sf.report.helper.metabase');
}

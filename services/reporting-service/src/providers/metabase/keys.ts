import {BindingKey} from '@loopback/core';
import {MetabaseReports} from './types';

export namespace MetabaseBindings {
  export const MetabaseHelper = BindingKey.create<
    MetabaseReports | string | null
  >('sf.report.helper.metabase');
}

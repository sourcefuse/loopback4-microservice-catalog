import {inject, Provider} from '@loopback/core';
import {MetabaseBindings, MetabaseReports} from './metabase';
import {IReporting} from './types';
export class ReportingProvider implements Provider<IReporting> {
  constructor(
    @inject(MetabaseBindings.MetabaseHelper)
    private readonly metabaseReportingHelper: MetabaseReports,
  ) {}

  value() {
    return this.metabaseReportingHelper;
  }
}

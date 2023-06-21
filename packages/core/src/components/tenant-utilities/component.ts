import {
  Application,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
  injectable,
} from '@loopback/core';
import {LoggerExtensionComponent} from '../logger-extension';
import {TenantUtilitiesBindings} from './keys';
import {TenantGuardService} from './services/tenant-guard.service';
import {ITenantUtilitiesOptions} from './types';

@injectable({
  tags: {[ContextTags.KEY]: TenantUtilitiesBindings.Component},
})
export class TenantUtilitiesComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    app: Application,
    @config({optional: true})
    configuration?: ITenantUtilitiesOptions,
  ) {
    app.component(LoggerExtensionComponent);
    app.bind(TenantUtilitiesBindings.GuardService).toClass(TenantGuardService);
  }
}

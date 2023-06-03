import {
  injectable,
  inject,
  asLifeCycleObserver,
  BindingScope,
  CoreBindings,
  LifeCycleObserver,
} from '@loopback/core';
import OidcProvider from 'oidc-provider';
import {OIDCServiceBindings} from '../keys';
import {RestApplication} from '@loopback/rest';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  asLifeCycleObserver,
)
export class OidcInitializerService implements LifeCycleObserver {
  constructor(
    @inject(OIDCServiceBindings.OIDC_PROVIDER)
    private oidcProvider: OidcProvider,
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {}

  async start() {
    this.application.mountExpressRouter('/', this.oidcProvider.callback());
  }
}

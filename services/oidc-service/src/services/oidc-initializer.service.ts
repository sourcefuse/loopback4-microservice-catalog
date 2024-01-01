import {
  BindingScope,
  CoreBindings,
  LifeCycleObserver,
  asLifeCycleObserver,
  inject,
  injectable,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
// eslint-disable-next-line @typescript-eslint/naming-convention
import OidcProvider from 'oidc-provider';
import {OIDCServiceBindings} from '../keys';

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

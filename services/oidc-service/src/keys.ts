import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';

import OidcProvider from 'oidc-provider';
import {FindAccountProviderFn} from './types';
export namespace OIDCServiceBindings {
  export const LoginTemplate = BindingKey.create<string>(
    `${BINDING_PREFIX}.oidc.template.login`,
  );
  export const InteractionTemplate = BindingKey.create<string>(
    `${BINDING_PREFIX}.oidc.template.interaction`,
  );
  export const OIDC_PROVIDER = BindingKey.create<OidcProvider>(
    `${BINDING_PREFIX}.oidc.provider`,
  );
  export const FIND_ACCOUNT_PROVIDER = BindingKey.create<FindAccountProviderFn>(
    `${BINDING_PREFIX}.oidc.findAccountProvider`,
  );
}

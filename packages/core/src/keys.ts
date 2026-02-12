// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {ExpressRequestHandler} from '@loopback/rest';
import {SetupDatasourceFn} from 'loopback4-dynamic-datasource';
import {BINDING_PREFIX} from './constants';
import {HttpMethod} from './enums';
import {UserModifiableEntity} from './models';
import {
  CoreConfig,
  IDefaultUserModifyCrud,
  TenantIdEncryptionFn,
} from './types';

export namespace SFCoreBindings {
  export const i18n = BindingKey.create<i18nAPI>(`${BINDING_PREFIX}.i18n`);

  export const config = BindingKey.create<CoreConfig>(
    'sf.packages.core.config',
  );

  export const EXPRESS_MIDDLEWARES = BindingKey.create<ExpressRequestHandler[]>(
    `sf.packages.core.expressMiddlewares`,
  );
  export const TENANTID_ENCRYPTION_PROVIDER =
    BindingKey.create<TenantIdEncryptionFn>(
      `sf.auth.tenantid.encryption.provider`,
    );
  export const DYNAMIC_DATASOURCE_MIDDLEWARES =
    BindingKey.create<SetupDatasourceFn>(
      `sf.packages.core.dynamicDatasourceMiddleware`,
    );

  export const DEFAULT_USER_MODIFY_CRUD_SERVICE = BindingKey.create<
    IDefaultUserModifyCrud<UserModifiableEntity, string | number>
  >(`${BINDING_PREFIX}.services.defaultUserModifyCrudService`);
}

const hiddenKey = 'sf.oas.hiddenEndpoints';

export type OasHiddenApi = {
  path: string;
  httpMethod: HttpMethod;
};

export namespace OASBindings {
  export const HiddenEndpoint = BindingKey.create<OasHiddenApi[]>(hiddenKey);
}

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {ExpressRequestHandler} from '@loopback/rest';
import {BINDING_PREFIX} from './constants';
import {HttpMethod} from './enums';
import {CoreConfig} from './types';

export namespace SFCoreBindings {
  export const i18n = BindingKey.create<i18nAPI>(`${BINDING_PREFIX}.i18n`);

  export const config = BindingKey.create<CoreConfig>(
    'sf.packages.core.config',
  );

  export const EXPRESS_MIDDLEWARES = BindingKey.create<ExpressRequestHandler[]>(
    `sf.packages.core.expressMiddlewares`,
  );
}

const hiddenKey = 'sf.oas.hiddenEndpoints';

export type OasHiddenApi = {
  path: string;
  httpMethod: HttpMethod;
};

export namespace OASBindings {
  export const HiddenEndpoint = BindingKey.create<OasHiddenApi[]>(hiddenKey);
}

import {BindingKey, Constructor} from '@loopback/core';
import {ExpressRequestHandler} from '@loopback/rest';
import {BINDING_PREFIX} from './constants';
import {CoreConfig} from './types';
import {HttpMethod} from './enums';
import {JoinExecutor} from './providers/types';
import {PostgreqlQueryBuilder, WhereBuilderFunction} from './providers/query';
import {Entity} from '@loopback/repository';

export namespace SFCoreBindings {
  export const i18n = BindingKey.create<i18nAPI>(`${BINDING_PREFIX}.i18n`);

  export const config = BindingKey.create<CoreConfig>(
    'sf.packages.core.config',
  );

  export const EXPRESS_MIDDLEWARES = BindingKey.create<ExpressRequestHandler[]>(
    `sf.packages.core.expressMiddlewares`,
  );
}

export namespace JoinBindings {
  export const Join = BindingKey.create<JoinExecutor>(
    `${BINDING_PREFIX}.join.executor`,
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

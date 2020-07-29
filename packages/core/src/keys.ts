import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from './constants';
import { CoreConfig } from './types';

export namespace SFCoreBindings {
  export const i18n = BindingKey.create<i18nAPI>(`${BINDING_PREFIX}.i18n`);

  export const config = BindingKey.create<CoreConfig>(
    'sf.videochatprovider.vonage.config',
  );
}


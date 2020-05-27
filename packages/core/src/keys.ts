import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from './constants';

export namespace SFCoreBindings {
  export const i18n = BindingKey.create<i18nAPI>(`${BINDING_PREFIX}.i18n`);
}

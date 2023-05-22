import {BindingKey} from '@loopback/core';

export namespace TemplateBindings {
  export const TemplateBasePath = BindingKey.create<string>('template.basePath')
}

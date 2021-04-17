import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {JsdomService, MarkdownService} from './services';
import {AwsConfig, LanguageTranslateProvider} from './types';

export namespace LanguageTranslateBindings {
  export const awsConfig = BindingKey.create<AwsConfig>(
    `${BINDING_PREFIX}.language-translate.aws.config`,
  );
  export const languageTranslateProvider = BindingKey.create<LanguageTranslateProvider>(
    `${BINDING_PREFIX}.language-translate.provider`,
  );
  export const jsDomService = BindingKey.create<JsdomService>(
    `${BINDING_PREFIX}.language-translate.service.jsdom`,
  );
  export const markdownService = BindingKey.create<MarkdownService>(
    `${BINDING_PREFIX}.language-translate.service.markdown`,
  );
}

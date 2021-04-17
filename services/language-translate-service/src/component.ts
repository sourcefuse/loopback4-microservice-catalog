import {Component, ControllerClass, CoreBindings, inject} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {AuthorizationBindings} from 'loopback4-authorization';
import {TranslateController} from './controllers';
import {LanguageTranslateBindings} from './keys';
import {TranslateModelDto} from './models';
import {AwsTranslateProvider, JsdomService, MarkdownService} from './services';
import {ServiceNames} from './types';
export class LanguageTranslateServiceComponent implements Component {
  controllers?: ControllerClass[] = [TranslateController];
  models: [TranslateModelDto];
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    const serviceName: ServiceNames = process.env.SERVICE_NAME as ServiceNames;
    if (serviceName === ServiceNames.AWS) {
      this.application.bind(LanguageTranslateBindings.awsConfig).to({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.region ?? 'us-east-1',
      });
      this.application
        .bind(LanguageTranslateBindings.languageTranslateProvider)
        .toProvider(AwsTranslateProvider);
    }
    this.application
      .bind(LanguageTranslateBindings.jsDomService)
      .toClass(JsdomService);
    this.application
      .bind(LanguageTranslateBindings.markdownService)
      .toClass(MarkdownService);
    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Language Translate Service',
        version: '1.0.0',
      },
      paths: {},
      components: {},
      servers: [{url: '/'}],
    });
  }
}

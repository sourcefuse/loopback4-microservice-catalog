import {
  Binding,
  Component,
  CoreBindings,
  ProviderMap,
  ServiceOrProviderClass,
  inject,
} from '@loopback/core';
import {RestApplication, createMiddlewareBinding} from '@loopback/rest';
import {
  DynamicDatasourceBindings,
  DynamicDatasourceMiddlewareProvider,
  Loopback4DynamicDatasourceComponent,
} from 'loopback4-dynamic-datasource';
import {BearerVerifierComponent} from '../bearer-verifier';
import {DynamicDataSourceBinding} from './keys';
import {
  DataSourceConfigProvider,
  DatasourceIdentifierProvider,
  DatasourceProvider,
} from './providers';
import {AwsSsmHelperService} from './services';

export class DynamicDatasourceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    this.providers = {};
    this.application.component(BearerVerifierComponent);
    this.application.component(Loopback4DynamicDatasourceComponent);
    this.bindings.push(
      createMiddlewareBinding(DynamicDatasourceMiddlewareProvider),
    );
    //Bind Providers
    this.providers[DynamicDatasourceBindings.DATASOURCE_PROVIDER.key] =
      DatasourceProvider;
    this.providers[
      DynamicDatasourceBindings.DATASOURCE_IDENTIFIER_PROVIDER.key
    ] = DatasourceIdentifierProvider;
    this.providers[DynamicDataSourceBinding.DATA_SOURCE_CONFIG_PROVIDER.key] =
      DataSourceConfigProvider;
    this.services = [AwsSsmHelperService];
  }
  providers?: ProviderMap;
  bindings: Binding[] = [];
  services?: ServiceOrProviderClass[];
}

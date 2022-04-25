import {Binding, Component, ProviderMap} from '@loopback/core';
import {RequestBindings} from './keys';
import {RequestProvider} from './providers';

export class RequestComponent implements Component {
  constructor() {}

  providers?: ProviderMap = {
    [RequestBindings.FetchProvider.key]: RequestProvider,
  };

  bindings?: Binding[] = [Binding.bind(RequestBindings.Config).to(null)];
}

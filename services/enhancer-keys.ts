import {BindingKey} from '@loopback/context';

const hiddenKey = 'sf.oas.hiddenEndpoints';

export type OasHiddenApi = {
  path: string,
  httpMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export namespace OASBindings {
  export const HiddenEndpoint = BindingKey.create<
    OasHiddenApi[]
  >(hiddenKey);
};
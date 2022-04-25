import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {
  IRequestServiceConfig
} from './types';
import { ResponseFormat } from './utils/response.fomatter';

export namespace RequestServiceBindings {
  export const Config = BindingKey.create<IRequestServiceConfig | null>(
    `${BINDING_PREFIX}.request.config`,
  );
}

export namespace ResponseFormatBindings {
  export const FORMAT_RESPONSE = BindingKey.create<ResponseFormat>(
    'services.formatter',
  );
}

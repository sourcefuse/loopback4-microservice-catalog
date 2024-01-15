import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class ClientAppDTO extends CoreModel<ClientAppDTO> {
  @property({
    type: 'string',
    required: true,
    description: 'An identifier for a client',
  })
  clientName: string;
}

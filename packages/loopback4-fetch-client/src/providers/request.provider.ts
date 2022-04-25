import {inject, Provider, ValueOrPromise} from '@loopback/core';
import {RequestInit} from 'node-fetch';
import {RequestBindings} from '../keys';
import {IRequest} from '../types';

export class RequestProvider implements Provider<IRequest> {
  constructor(
    @inject(RequestBindings.FetchProvider, {
      optional: false,
    })
    private readonly fetchProvider: IRequest,
  ) {}

  value(): ValueOrPromise<IRequest> {
    return {
      send: async (url: string, req: RequestInit) => this.sendRequest(url, req),
    };
  }

  sendRequest(url: string, req: RequestInit) {
    if (req.method && this.fetchProvider) {
      return this.fetchProvider.send(url, req);
    }
  }
}

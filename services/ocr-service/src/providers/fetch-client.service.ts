// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  injectable,
  inject,
  BindingScope,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {Agent as HttpAgent} from 'http';
import {Agent as HttpsAgent} from 'https';
import fetch, {RequestInit} from 'node-fetch';
import urlJoin from 'url-join';
import {
  identityResponseTransformer,
  jsonResponseTransformer,
  Header,
  HttpClientInitOpts,
  HttpMethod,
  RequestInterceptor,
  ResponseTransformer,
  IRequestServiceConfig,
} from '../types';
import {RequestServiceBindings} from '../keys';

@injectable({scope: BindingScope.TRANSIENT})
export class FetchClientProvider implements Provider<IRequestServiceConfig> {
  readonly baseUrl: string;
  readonly baseHeaders: Record<string, string>;
  readonly baseOptions: Omit<RequestInit, 'headers'>;
  readonly useJson: boolean;

  protected transformResponse: ResponseTransformer;
  protected willSendRequest?: RequestInterceptor;

  constructor(
    @inject(RequestServiceBindings.Config, {
      optional: false,
    })
    private readonly fetchConfig: HttpClientInitOpts,
  ) {
    // sonarignore:start
    const {baseUrl, baseHeaders, baseOptions, json} = this
      .fetchConfig as HttpClientInitOpts;
    // sonarignore:end

    const {protocol} = new URL(baseUrl);

    const isHttps = protocol.startsWith('https');
    const useJson = Boolean(json);

    const agentOpts = {
      keepAlive: true,
      maxSockets: 64,
      keepAliveMsecs: 5000,
    };

    const jsonHeaders = useJson
      ? {
          [Header.Accept]: 'application/json',
          [Header.ContentType]: 'application/json',
        }
      : undefined;

    this.baseUrl = baseUrl;

    this.baseHeaders = {
      ...jsonHeaders,
      ...baseHeaders,
    };

    this.baseOptions = {
      agent: isHttps ? new HttpsAgent(agentOpts) : new HttpAgent(agentOpts),
      ...baseOptions,
    };

    this.transformResponse = useJson
      ? jsonResponseTransformer
      : identityResponseTransformer;

    this.useJson = useJson;
  }
  // sonarignore:start
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  value(): ValueOrPromise<any> {
    // sonarignore:end

    return {
      sendRequest: async (url: string, method: string) =>
        this.sendRequest(url, method),
    };
  }

  sendRequest(url: string, method: string) {
    if (method?.toUpperCase() === 'POST') {
      return this.post(url);
    } else if (method?.toUpperCase() === 'GET') {
      return this.get(url);
    } else if (method?.toUpperCase() === 'PUT') {
      return this.put(url);
    } else if (method?.toUpperCase() === 'PATCH') {
      return this.patch(url);
    } else if (method?.toUpperCase() === 'DELETE') {
      return this.delete(url);
    } else {
      //do nothing
      return;
    }
  }

  async get<T>(url: string, req: RequestInit = {}): Promise<T> {
    const {transformResponse, willSendRequest} = this;

    const args = await this.buildRequestArgs(
      url,
      HttpMethod.Get,
      undefined,
      req,
    );

    if (willSendRequest) {
      await willSendRequest(args.url, args.request);
    }

    const response = await fetch(args.url, args.request);

    return transformResponse(response);
  }
  // sonarignore:start
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  async post<T>(url: string, body?: any, req: RequestInit = {}): Promise<T> {
    // sonarignore:end
    const {transformResponse, willSendRequest} = this;

    const args = await this.buildRequestArgs(url, HttpMethod.Post, body, req);

    if (willSendRequest) {
      await willSendRequest(args.url, args.request);
    }

    const response = await fetch(args.url, args.request);

    return transformResponse(response);
  }
  // sonarignore:start
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  async put<T>(url: string, body?: any, req: RequestInit = {}): Promise<T> {
    // sonarignore:end
    const {transformResponse, willSendRequest} = this;

    const args = await this.buildRequestArgs(url, HttpMethod.Put, body, req);

    if (willSendRequest) {
      await willSendRequest(args.url, args.request);
    }

    const response = await fetch(args.url, args.request);

    return transformResponse(response);
  }
  // sonarignore:start
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  async patch<T>(url: string, body?: any, req: RequestInit = {}): Promise<T> {
    // sonarignore:end
    const {transformResponse, willSendRequest} = this;

    const args = await this.buildRequestArgs(url, HttpMethod.Patch, body, req);

    if (willSendRequest) {
      await willSendRequest(args.url, args.request);
    }

    const response = await fetch(args.url, args.request);

    return transformResponse(response);
  }

  async delete<T>(url: string, req: RequestInit = {}): Promise<T> {
    const {transformResponse, willSendRequest} = this;

    const args = await this.buildRequestArgs(
      url,
      HttpMethod.Delete,
      undefined,
      req,
    );

    if (willSendRequest) {
      await willSendRequest(args.url, args.request);
    }

    const response = await fetch(args.url, args.request);

    return transformResponse(response);
  }
  // sonarignore:start
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  private async buildRequestArgs(
    url: string,
    method: HttpMethod,
    body: any,
    opts: RequestInit,
  ): // sonarignore:end
  Promise<{url: string; request: RequestInit}> {
    return {
      url: urlJoin(this.baseUrl, url),
      request: {
        ...this.baseOptions,
        method,
        body: this.useJson && body ? JSON.stringify(body) : body,
        ...opts,
        headers: {
          ...this.baseHeaders,
          ...opts.headers,
        },
      },
    };
  }
}

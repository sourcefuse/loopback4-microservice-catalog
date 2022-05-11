import {IServiceConfig} from '@sourceloop/core';
import {RequestInit, Response} from 'node-fetch';
export interface IRequestServiceConfig extends IServiceConfig {
  useRequestProvider: boolean;
  baseUrl: string;
  baseHeaders?: Record<string, string>;
  baseOptions?: Omit<RequestInit, 'headers'>;
  json?: boolean;
}

export type ClauseProps = {
  contractFileName: string;
  extractedData?: {
    column?: string;
    columnData?: {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      supportedValue: Array<string> | any;
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      value?: string | any;
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      pageNum?: number | any;
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      coordinates?: Object | any;
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      confidenceScore?: number | any;
    };
  };
};

export type OcrClause = {
  [key: string]: ClauseProps;
};

export type OcrObject = {
  id: string;
  text: string;
  confidenceLevel: number;
  modifiedBy: string;
};

export type RequestInterceptor = (
  url: string,
  request: RequestInit,
) => void | Promise<void>;

export type ResponseTransformer = (res: Response) => any;

export interface HttpClientInitOpts {
  baseUrl: string;
  baseHeaders?: Record<string, string>;
  baseOptions?: Omit<RequestInit, 'headers'>;
  json?: boolean;
}

export enum Header {
  Authorization = 'authorization',
  Accept = 'accept',
  ContentLength = 'content-length',
  ContentType = 'content-type',
  CorrelationId = 'x-correlation-id',
  IdToken = 'x-id-token',
  UserAgent = 'user-agent',
}

export enum HttpMethod {
  Get = 'get',
  Post = 'post',
  Patch = 'patch',
  Put = 'put',
  Delete = 'delete',
}

export interface IRequest {
  sendRequest(url: string, method: string): Promise<void>;
}

export interface FetchHttpRequest {
  sendRequest(url: string, method: string): Promise<void>;
}

export const identityResponseTransformer: ResponseTransformer = (
  response: Response,
) => response;

export interface IRequestServiceConfig extends IServiceConfig {}

export const jsonResponseTransformer: ResponseTransformer = (
  response: Response,
) => {
  const contentType = response.headers.get(Header.ContentType);
  const contentLength = response.headers.get(Header.ContentLength);

  if (
    contentType?.startsWith('application/json') &&
    response.status !== 204 &&
    contentLength !== '0'
  ) {
    return response.clone().json();
  } else {
    return response.clone().text();
  }
};

export const OcrDbSourceName = 'OcrDbSourceName';

// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IServiceConfig, STATUS_CODE} from '@sourceloop/core';
import {RequestInit, Response} from 'node-fetch';
export interface IRequestServiceConfig extends IServiceConfig {
  useRequestProvider: boolean;
  baseUrl: string;
  baseHeaders?: Record<string, string>;
  baseOptions?: Omit<RequestInit, 'headers'>;
  json?: boolean;
}

export type CoordinateType = {
  x: number;
  y: number;
  height: number;
  width: number;
};

export type ClauseProps = {
  contractFileName: string;
  extractedData: {
    column: string;
    columnData: {
      supportedValue: Array<string> | null;
      value: string;
      pageNum: number;
      coordinates: CoordinateType | null;
      confidenceScore: number;
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
// sonarignore:start
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type ResponseTransformer = (res: Response) => any;
// sonarignore:end

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
    response.status !== STATUS_CODE.NO_CONTENT &&
    contentLength !== '0'
  ) {
    return response.clone().json();
  } else {
    return response.clone().text();
  }
};

export type CreateClauseData = {
  clauseType: string;
  contractName: string;
};

export type ClauseResponse = {
  status: number;
  message: string;
};

export const OcrDbSourceName = 'OcrDbSourceName';

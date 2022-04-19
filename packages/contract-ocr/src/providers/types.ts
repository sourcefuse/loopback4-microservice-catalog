import { RequestInit, Response } from "node-fetch";
import { IRequest } from "../types";

export interface HttpRequest extends IRequest {
  send(url: string, request: RequestInit): Promise<void>;
}

export type RequestInterceptor = (
  url: string,
  request: RequestInit,
) => void | Promise<void>;

export type ResponseTransformer = (res: Response) => any;

export type HttpClientInitOpts = {
  baseUrl: string;
  baseHeaders?: Record<string, string>;
  baseOptions?: Omit<RequestInit, "headers">;
  json?: boolean;
};

export enum Header {
  Authorization = "authorization",
  Accept = "accept",
  ContentLength = "content-length",
  ContentType = "content-type",
  CorrelationId = "x-correlation-id",
  IdToken = "x-id-token",
  UserAgent = "user-agent",
}

export enum HttpMethod {
  Get = "get",
  Post = "post",
  Patch = "patch",
  Put = "put",
  Delete = "delete",
}
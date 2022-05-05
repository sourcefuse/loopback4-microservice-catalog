import { RequestInit, Response } from "node-fetch";
export interface IRequest {
    send(url: string, request: RequestInit): Promise<void>;
}
export declare type RequestInterceptor = (url: string, request: RequestInit) => void | Promise<void>;
export declare type ResponseTransformer = (res: Response) => any;
export interface HttpClientInitOpts {
    baseUrl: string;
    baseHeaders?: Record<string, string>;
    baseOptions?: Omit<RequestInit, "headers">;
    json?: boolean;
}
export declare enum Header {
    Authorization = "authorization",
    Accept = "accept",
    ContentLength = "content-length",
    ContentType = "content-type",
    CorrelationId = "x-correlation-id",
    IdToken = "x-id-token",
    UserAgent = "user-agent"
}
export declare enum HttpMethod {
    Get = "get",
    Post = "post",
    Patch = "patch",
    Put = "put",
    Delete = "delete"
}

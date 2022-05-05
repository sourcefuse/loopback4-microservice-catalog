import { RequestInit } from "node-fetch";
import { IRequest, ResponseTransformer } from "../../types";
export interface FetchHttpRequest extends IRequest {
    send(url: string, request: RequestInit): Promise<void>;
}
export declare const identityResponseTransformer: ResponseTransformer;
export declare const jsonResponseTransformer: ResponseTransformer;

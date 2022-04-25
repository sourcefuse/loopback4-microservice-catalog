import { RequestInit, Response } from "node-fetch";
import { Header, IRequest, ResponseTransformer } from "../../types";


export interface FetchHttpRequest extends IRequest {
  send(url: string, request: RequestInit): Promise<void>;
}

export const identityResponseTransformer: ResponseTransformer = (response: Response) => response;


export const jsonResponseTransformer: ResponseTransformer = (response: Response) => {
  const contentType = response.headers.get(Header.ContentType);
  const contentLength = response.headers.get(Header.ContentLength);

  if (
    contentType?.startsWith("application/json") &&
    response.status !== 204 &&
    contentLength !== "0"
  ) {
    return response.clone().json();
  } else {
    return response.clone().text();
  }
};
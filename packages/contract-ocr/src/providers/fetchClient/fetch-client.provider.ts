import {
    inject,
    Provider,
    ValueOrPromise
} from '@loopback/core';
import {
    Agent as HttpAgent
} from "http";
import {
    Agent as HttpsAgent
} from "https";
import fetch, {
    RequestInit
} from "node-fetch";
import urlJoin from "url-join";
import {
    FetchHttpRequest,
    identityResponseTransformer,
    jsonResponseTransformer
} from "./types";

import {
    Header,
    HttpClientInitOpts,
    HttpMethod,
    RequestInterceptor,
    ResponseTransformer,
} from "../types";
import { RequestBindings } from '../../keys';

export class fetchClient implements Provider <FetchHttpRequest> {
    readonly baseUrl: string;
    readonly baseHeaders: Record < string,
    string > ;
    readonly baseOptions: Omit < RequestInit,
    "headers" > ;
    readonly useJson: boolean;

    protected transformResponse: ResponseTransformer;
    protected willSendRequest ? : RequestInterceptor;

    constructor(
        @inject(RequestBindings.Config, {
            optional: false,
        }) private readonly fetchConfig: HttpClientInitOpts,
    ) {
        const {
            baseUrl,
            baseHeaders,
            baseOptions,
            json
        } = this.fetchConfig as HttpClientInitOpts;

        const {
            protocol
        } = new URL(baseUrl);

        const isHttps = protocol.startsWith("https");
        const useJson = Boolean(json);

        const agentOpts = {
            keepAlive: true,
            maxSockets: 64,
            keepAliveMsecs: 5000,
        };

        const jsonHeaders = useJson ? {
                [Header.Accept]: "application/json",
                [Header.ContentType]: "application/json",
            } :
            undefined;

        this.baseUrl = baseUrl;

        this.baseHeaders = {
            ...jsonHeaders,
            ...baseHeaders,
        };

        this.baseOptions = {
            agent: isHttps ? new HttpsAgent(agentOpts) : new HttpAgent(agentOpts),
            ...baseOptions,
        };

        this.transformResponse = useJson ?
            jsonResponseTransformer :
            identityResponseTransformer;

        this.useJson = useJson;
    }
    value(): ValueOrPromise < FetchHttpRequest > {
        return {
            send: async (url: string, req: RequestInit) => {
                if (req.method?.toUpperCase() === 'POST') {
                    return this.post(url, req)
                }
            }
        };
    }

    async get < T > (url: string, req: RequestInit = {}): Promise < T > {
        const {
            transformResponse,
            willSendRequest
        } = this;

        const args = await this.buildRequestArgs(url, HttpMethod.Get, undefined, req);

        if (willSendRequest) {
            await willSendRequest(args.url, args.request);
        }

        const response = await fetch(args.url, args.request);

        return transformResponse(response);
    };

    async post < T > (
        url: string,
        body ? : any,
        req: RequestInit = {},
    ): Promise < T > {
        const {
            transformResponse,
            willSendRequest
        } = this;

        const args = await this.buildRequestArgs(url, HttpMethod.Post, body, req);

        if (willSendRequest) {
            await willSendRequest(args.url, args.request);
        }

        const response = await fetch(args.url, args.request);

        return transformResponse(response);
    };

    async put < T > (
        url: string,
        body ? : any,
        req: RequestInit = {},
    ): Promise < T > {
        const {
            transformResponse,
            willSendRequest
        } = this;

        const args = await this.buildRequestArgs(url, HttpMethod.Put, body, req);

        if (willSendRequest) {
            await willSendRequest(args.url, args.request);
        }

        const response = await fetch(args.url, args.request);

        return transformResponse(response);
    };

    async patch < T > (
        url: string,
        body ? : any,
        req: RequestInit = {},
    ): Promise < T > {
        const {
            transformResponse,
            willSendRequest
        } = this;

        const args = await this.buildRequestArgs(url, HttpMethod.Patch, body, req);

        if (willSendRequest) {
            await willSendRequest(args.url, args.request);
        }

        const response = await fetch(args.url, args.request);

        return transformResponse(response);
    };

    async delete < T > (url: string, req: RequestInit = {}): Promise < T > {
        const {
            transformResponse,
            willSendRequest
        } = this;

        const args = await this.buildRequestArgs(url, HttpMethod.Delete, undefined, req);

        if (willSendRequest) {
            await willSendRequest(args.url, args.request);
        }

        const response = await fetch(args.url, args.request);

        return transformResponse(response);
    };

    private async buildRequestArgs(
        url: string,
        method: HttpMethod,
        body: any,
        opts: RequestInit,
    ): Promise < {
        url: string;request: RequestInit
    } > {
        const args = {
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

        return args;
    };
}
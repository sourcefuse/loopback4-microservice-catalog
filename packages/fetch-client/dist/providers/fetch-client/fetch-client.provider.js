"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchClient = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const http_1 = require("http");
const https_1 = require("https");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const url_join_1 = tslib_1.__importDefault(require("url-join"));
const types_1 = require("./types");
const types_2 = require("../../types");
const keys_1 = require("../../keys");
let fetchClient = class fetchClient {
    constructor(fetchConfig) {
        this.fetchConfig = fetchConfig;
        const { baseUrl, baseHeaders, baseOptions, json } = this.fetchConfig;
        const { protocol } = new URL(baseUrl);
        const isHttps = protocol.startsWith("https");
        const useJson = Boolean(json);
        const agentOpts = {
            keepAlive: true,
            maxSockets: 64,
            keepAliveMsecs: 5000,
        };
        const jsonHeaders = useJson ? {
            [types_2.Header.Accept]: "application/json",
            [types_2.Header.ContentType]: "application/json",
        } :
            undefined;
        this.baseUrl = baseUrl;
        this.baseHeaders = {
            ...jsonHeaders,
            ...baseHeaders,
        };
        this.baseOptions = {
            agent: isHttps ? new https_1.Agent(agentOpts) : new http_1.Agent(agentOpts),
            ...baseOptions,
        };
        this.transformResponse = useJson ?
            types_1.jsonResponseTransformer :
            types_1.identityResponseTransformer;
        this.useJson = useJson;
    }
    value() {
        return {
            send: async (url, req) => {
                var _a, _b, _c, _d, _e;
                if (((_a = req.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === 'POST') {
                    return this.post(url, req);
                }
                if (((_b = req.method) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === 'GET') {
                    return this.get(url, req);
                }
                if (((_c = req.method) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === 'PUT') {
                    return this.put(url, req);
                }
                if (((_d = req.method) === null || _d === void 0 ? void 0 : _d.toUpperCase()) === 'PATCH') {
                    return this.patch(url, req);
                }
                if (((_e = req.method) === null || _e === void 0 ? void 0 : _e.toUpperCase()) === 'DELETE') {
                    return this.delete(url, req);
                }
            }
        };
    }
    async get(url, req = {}) {
        const { transformResponse, willSendRequest } = this;
        const args = await this.buildRequestArgs(url, types_2.HttpMethod.Get, undefined, req);
        if (willSendRequest) {
            await willSendRequest(args.url, args.request);
        }
        const response = await (0, node_fetch_1.default)(args.url, args.request);
        return transformResponse(response);
    }
    ;
    async post(url, body, req = {}) {
        const { transformResponse, willSendRequest } = this;
        console.log(body);
        const args = await this.buildRequestArgs(url, types_2.HttpMethod.Post, body, req);
        if (willSendRequest) {
            await willSendRequest(args.url, args.request);
        }
        const response = await (0, node_fetch_1.default)(args.url, args.request);
        console.log(JSON.stringify(response));
        return transformResponse(response);
    }
    ;
    async put(url, body, req = {}) {
        const { transformResponse, willSendRequest } = this;
        const args = await this.buildRequestArgs(url, types_2.HttpMethod.Put, body, req);
        if (willSendRequest) {
            await willSendRequest(args.url, args.request);
        }
        const response = await (0, node_fetch_1.default)(args.url, args.request);
        return transformResponse(response);
    }
    ;
    async patch(url, body, req = {}) {
        const { transformResponse, willSendRequest } = this;
        const args = await this.buildRequestArgs(url, types_2.HttpMethod.Patch, body, req);
        if (willSendRequest) {
            await willSendRequest(args.url, args.request);
        }
        const response = await (0, node_fetch_1.default)(args.url, args.request);
        return transformResponse(response);
    }
    ;
    async delete(url, req = {}) {
        const { transformResponse, willSendRequest } = this;
        const args = await this.buildRequestArgs(url, types_2.HttpMethod.Delete, undefined, req);
        if (willSendRequest) {
            await willSendRequest(args.url, args.request);
        }
        const response = await (0, node_fetch_1.default)(args.url, args.request);
        return transformResponse(response);
    }
    ;
    async buildRequestArgs(url, method, body, opts) {
        const args = {
            url: (0, url_join_1.default)(this.baseUrl, url),
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
    }
    ;
};
fetchClient = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.RequestBindings.Config, {
        optional: false,
    })),
    tslib_1.__metadata("design:paramtypes", [Object])
], fetchClient);
exports.fetchClient = fetchClient;
//# sourceMappingURL=fetch-client.provider.js.map
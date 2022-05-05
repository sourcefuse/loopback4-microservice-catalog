"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
let RequestProvider = class RequestProvider {
    constructor(fetchProvider) {
        this.fetchProvider = fetchProvider;
    }
    value() {
        return {
            send: async (url, req) => this.sendRequest(url, req)
        };
    }
    sendRequest(url, req) {
        if (req.method && this.fetchProvider) {
            return this.fetchProvider.send(url, req);
        }
    }
};
RequestProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.RequestBindings.FetchProvider, {
        optional: false
    })),
    tslib_1.__metadata("design:paramtypes", [Object])
], RequestProvider);
exports.RequestProvider = RequestProvider;
//# sourceMappingURL=request.provider.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonResponseTransformer = exports.identityResponseTransformer = void 0;
const types_1 = require("../../types");
const identityResponseTransformer = (response) => response;
exports.identityResponseTransformer = identityResponseTransformer;
const jsonResponseTransformer = (response) => {
    const contentType = response.headers.get(types_1.Header.ContentType);
    const contentLength = response.headers.get(types_1.Header.ContentLength);
    if ((contentType === null || contentType === void 0 ? void 0 : contentType.startsWith("application/json")) &&
        response.status !== 204 &&
        contentLength !== "0") {
        return response.clone().json();
    }
    else {
        return response.clone().text();
    }
};
exports.jsonResponseTransformer = jsonResponseTransformer;
//# sourceMappingURL=types.js.map
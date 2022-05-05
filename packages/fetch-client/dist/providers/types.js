"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethod = exports.Header = void 0;
var Header;
(function (Header) {
    Header["Authorization"] = "authorization";
    Header["Accept"] = "accept";
    Header["ContentLength"] = "content-length";
    Header["ContentType"] = "content-type";
    Header["CorrelationId"] = "x-correlation-id";
    Header["IdToken"] = "x-id-token";
    Header["UserAgent"] = "user-agent";
})(Header = exports.Header || (exports.Header = {}));
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["Get"] = "get";
    HttpMethod["Post"] = "post";
    HttpMethod["Patch"] = "patch";
    HttpMethod["Put"] = "put";
    HttpMethod["Delete"] = "delete";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
//# sourceMappingURL=types.js.map
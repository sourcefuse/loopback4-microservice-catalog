"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestBindings = void 0;
const core_1 = require("@loopback/core");
var RequestBindings;
(function (RequestBindings) {
    RequestBindings.FetchProvider = core_1.BindingKey.create('sf.request.fetch');
    RequestBindings.Config = core_1.BindingKey.create('sf.request.config');
})(RequestBindings = exports.RequestBindings || (exports.RequestBindings = {}));
//# sourceMappingURL=keys.js.map
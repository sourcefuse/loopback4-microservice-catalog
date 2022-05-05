"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestComponent = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("./keys");
const providers_1 = require("./providers");
class RequestComponent {
    constructor() {
        this.providers = {
            [keys_1.RequestBindings.FetchProvider.key]: providers_1.RequestProvider
        };
        this.bindings = [
            core_1.Binding.bind(keys_1.RequestBindings.Config).to(null)
        ];
    }
}
exports.RequestComponent = RequestComponent;
//# sourceMappingURL=component.js.map
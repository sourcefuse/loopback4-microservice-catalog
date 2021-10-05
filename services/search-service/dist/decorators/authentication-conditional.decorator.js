"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateOnCondition = void 0;
const loopback4_authentication_1 = require("loopback4-authentication");
function authenticateOnCondition(condition) {
    if (condition) {
        return loopback4_authentication_1.authenticate("bearer" /* BEARER */);
    }
    else {
        return () => { };
    }
}
exports.authenticateOnCondition = authenticateOnCondition;
//# sourceMappingURL=authentication-conditional.decorator.js.map
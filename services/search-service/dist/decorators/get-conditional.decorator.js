"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnCondition = void 0;
const rest_1 = require("@loopback/rest");
function getOnCondition(condition, path, spec) {
    if (condition) {
        return rest_1.get(path, spec);
    }
    else {
        return () => { };
    }
}
exports.getOnCondition = getOnCondition;
//# sourceMappingURL=get-conditional.decorator.js.map
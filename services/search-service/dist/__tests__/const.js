"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testModelList = void 0;
const fixtures_1 = require("./fixtures");
exports.testModelList = [
    fixtures_1.TestSearched,
    {
        model: fixtures_1.TestSearchedCustom,
        columns: {
            description: 'about',
            name: 'identifier',
        },
    },
];
//# sourceMappingURL=const.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTestsRunner = void 0;
const fixtures_1 = require("../fixtures");
function buildTestsRunner(builderClass, tests, match, expect, models) {
    return () => {
        tests.forEach(test => {
            it(test.it, () => {
                const builder = new builderClass({
                    match,
                    ...test.params,
                });
                if (test.error) {
                    try {
                        builder.build(models, fixtures_1.TestSearchModel);
                        throw new Error(`Expected: ${test.message}, but did'nt get one`);
                    }
                    catch (err) {
                        expect(err).to.be.instanceOf(test.error);
                        expect(err.message).to.be.equal(test.message);
                    }
                }
                else {
                    expect(builder.build(models, fixtures_1.TestSearchModel)).to.deepEqual({
                        query: test.expects,
                        params: [match],
                    });
                }
            });
        });
    };
}
exports.buildTestsRunner = buildTestsRunner;
//# sourceMappingURL=runner.js.map
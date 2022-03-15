"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDependencyVersion = exports.appendDependencies = exports.JSON_SPACING = void 0;
exports.JSON_SPACING = 4;
function appendDependencies(dependencies) {
    var _a, _b;
    const packageJson = require('../package.json');
    const deps = Object.assign({}, dependencies);
    const newDependencies = (_b = (_a = packageJson === null || packageJson === void 0 ? void 0 : packageJson.config) === null || _a === void 0 ? void 0 : _a.templateDependencies) !== null && _b !== void 0 ? _b : {};
    for (const i in newDependencies) {
        if (newDependencies[i]) {
            deps[i] = newDependencies[i];
        }
        else {
            throw new Error(`Missing dependency version in config: ${i}`);
        }
    }
    return deps;
}
exports.appendDependencies = appendDependencies;
function getDependencyVersion(dependencies, name) {
    var _a, _b;
    const packageJson = require('../package.json');
    const newDependencies = (_b = (_a = packageJson === null || packageJson === void 0 ? void 0 : packageJson.config) === null || _a === void 0 ? void 0 : _a.templateDependencies) !== null && _b !== void 0 ? _b : {};
    const deps = Object.assign(dependencies, newDependencies);
    if (deps[name]) {
        return deps[name];
    }
    else {
        throw new Error(`Missing dependency version in config: ${name}`);
    }
}
exports.getDependencyVersion = getDependencyVersion;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDependencyVersion = exports.appendDependencies = void 0;
function appendDependencies(dependencies) {
    const packageJson = require('../package.json');
    const deps = Object.assign({}, dependencies);
    const newDependencies = (packageJson.config && packageJson.config.templateDependencies) || {};
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
    const packageJson = require('../package.json');
    const newDependencies = (packageJson.config && packageJson.config.templateDependencies) || {};
    const deps = Object.assign(dependencies, newDependencies);
    if (deps[name]) {
        return deps[name];
    }
    else {
        throw new Error(`Missing dependency version in config: ${name}`);
    }
}
exports.getDependencyVersion = getDependencyVersion;

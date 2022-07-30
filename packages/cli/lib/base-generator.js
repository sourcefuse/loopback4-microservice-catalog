"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGenerator = void 0;
const tslib_1 = require("tslib");
// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const yeoman_generator_1 = tslib_1.__importDefault(require("yeoman-generator"));
class BaseGenerator extends yeoman_generator_1.default {
    constructor(args, opts) {
        super(args, opts);
        this.root = '';
    }
    copyTemplates() {
        (0, fs_1.readdirSync)(this.templatePath()).forEach(file => {
            const targetFileName = file.replace('.tpl', '');
            const sourcePath = this.templatePath(file);
            const destinationPath = (0, path_1.join)(this.destinationRoot(), targetFileName);
            this.fs.copyTpl(sourcePath, destinationPath, this.options);
        });
    }
    name() {
        return this.options.namespace.split(':')[1];
    }
    destinationRoot(rootPath) {
        if (rootPath) {
            this.root = rootPath;
        }
        return super.destinationRoot(rootPath);
    }
    exit(reason) {
        if (!!reason)
            return;
        this.exitGeneration = reason;
    }
    shouldExit() {
        return !!this.exitGeneration;
    }
    async createFolders(names, force = false) {
        for (const name of names) {
            await (0, promises_1.mkdir)(`${(0, path_1.join)(this.destinationRoot(), name)}`, {
                recursive: force,
            });
        }
    }
}
exports.BaseGenerator = BaseGenerator;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrS3ServiceComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const core_2 = require("@sourceloop/core");
const loopback4_s3_1 = require("loopback4-s3");
const controllers_1 = require("./controllers");
const models_1 = require("./models");
const repositories_1 = require("./repositories");
let OcrS3ServiceComponent = class OcrS3ServiceComponent {
    constructor(application) {
        this.application = application;
        this.providers = {};
        this.bindings = [];
        this.bindings = [];
        this.providers = {};
        // Mount core component
        this.application.component(core_2.CoreComponent);
        this.application.api({
            openapi: '3.0.0',
            info: {
                title: 'Ocr S3 Service',
                version: '1.0.0',
            },
            paths: {},
            components: {
                securitySchemes: core_2.SECURITY_SCHEME_SPEC,
            },
            servers: [{ url: '/' }],
        });
        // Mount AWS S3 component
        this.application.component(loopback4_s3_1.AwsS3Component);
        this.bindings.push(core_1.Binding.bind(loopback4_s3_1.AWSS3Bindings.Config).to({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        }));
        this.setupSequence();
        this.repositories = [repositories_1.HocrObjectRepository];
        this.models = [models_1.HocrObject];
        this.controllers = [controllers_1.OcrObjectController];
    }
    /**
     * Setup ServiceSequence by default if no other sequnce provided
     *
     */
    setupSequence() {
        this.application.sequence(core_2.ServiceSequence);
    }
};
OcrS3ServiceComponent = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__metadata("design:paramtypes", [rest_1.RestApplication])
], OcrS3ServiceComponent);
exports.OcrS3ServiceComponent = OcrS3ServiceComponent;
//# sourceMappingURL=component.js.map
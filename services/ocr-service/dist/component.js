"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchServiceComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const core_2 = require("@sourceloop/core");
const dist_1 = require("../../../packages/fetch-client/dist");
const controllers_1 = require("./controllers");
const models_1 = require("./models");
const repositories_1 = require("./repositories");
let FetchServiceComponent = class FetchServiceComponent {
    constructor(application) {
        var _a;
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
                title: 'Ocr Service',
                version: '1.0.0',
            },
            paths: {},
            components: {
                securitySchemes: core_2.SECURITY_SCHEME_SPEC,
            },
            servers: [{ url: '/' }],
        });
        // Mount OCR component
        this.application.component(dist_1.RequestComponent);
        this.bindings.push(core_1.Binding.bind(dist_1.RequestBindings.Config).to({
            baseUrl: (_a = process.env.CLM_ML_BASEURL) !== null && _a !== void 0 ? _a : '',
            json: true
        }), core_1.Binding.bind(dist_1.RequestBindings.FetchProvider).toProvider(dist_1.fetchClient));
        this.setupSequence();
        this.repositories = [
            repositories_1.ContractRepository,
            repositories_1.OcrResultRepository,
            repositories_1.HocrResultRepository
        ];
        this.models = [models_1.Contracts, models_1.OcrResults, models_1.HocrResults];
        this.controllers = [
            controllers_1.ContractController,
            controllers_1.OcrController,
            controllers_1.OcrHooksController
        ];
    }
    /**
     * Setup ServiceSequence by default if no other sequnce provided
     *
     */
    setupSequence() {
        this.application.sequence(core_2.ServiceSequence);
    }
};
FetchServiceComponent = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__metadata("design:paramtypes", [rest_1.RestApplication])
], FetchServiceComponent);
exports.FetchServiceComponent = FetchServiceComponent;
//# sourceMappingURL=component.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClmS3ServiceApplication = void 0;
const tslib_1 = require("tslib");
const boot_1 = require("@loopback/boot");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const service_proxy_1 = require("@loopback/service-proxy");
const path = tslib_1.__importStar(require("path"));
const component_1 = require("./component");
class ClmS3ServiceApplication extends (0, boot_1.BootMixin)((0, service_proxy_1.ServiceMixin)((0, repository_1.RepositoryMixin)(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        this.static('/', path.join(__dirname, '../public'));
        this.component(component_1.OcrS3ServiceComponent);
        this.projectRoot = __dirname;
        this.bootOptions = {
            controllers: {
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }
}
exports.ClmS3ServiceApplication = ClmS3ServiceApplication;
//# sourceMappingURL=application.js.map
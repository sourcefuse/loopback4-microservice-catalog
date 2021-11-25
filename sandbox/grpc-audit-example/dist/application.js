"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcTestApplication = void 0;
const boot_1 = require("@loopback/boot");
const core_1 = require("@loopback/core");
const grpc_1 = require("@loopback/grpc");
const repository_1 = require("@loopback/repository");
const service_proxy_1 = require("@loopback/service-proxy");
class GrpcTestApplication extends boot_1.BootMixin(service_proxy_1.ServiceMixin(repository_1.RepositoryMixin(core_1.Application))) {
    constructor(options = {}) {
        super(options);
        this.component(grpc_1.GrpcComponent);
        // this.bind(`repository.${AuditDbSourceName}`).toClass(Audit)
        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }
}
exports.GrpcTestApplication = GrpcTestApplication;
//# sourceMappingURL=application.js.map
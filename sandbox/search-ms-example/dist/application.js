"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchMsExampleApplication = void 0;
const tslib_1 = require("tslib");
const boot_1 = require("@loopback/boot");
const rest_explorer_1 = require("@loopback/rest-explorer");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const service_proxy_1 = require("@loopback/service-proxy");
const path_1 = tslib_1.__importDefault(require("path"));
const sequence_1 = require("./sequence");
const dist_1 = require("../../../services/search-service/dist");
const models_1 = require("./models");
const core_1 = require("@sourceloop/core");
class SearchMsExampleApplication extends boot_1.BootMixin(service_proxy_1.ServiceMixin(repository_1.RepositoryMixin(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        // Set up default home page
        this.static('/', path_1.default.join(__dirname, '../public'));
        // Customize @loopback/rest-explorer configuration here
        this.configure(rest_explorer_1.RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(rest_explorer_1.RestExplorerComponent);
        this.api({
            openapi: '3.0.0',
            paths: {},
            info: {
                title: 'Search API Example',
                version: '1.0',
            },
            components: {
                securitySchemes: core_1.SECURITY_SCHEME_SPEC,
            },
        });
        this.bind(dist_1.SearchServiceBindings.Config).to({
            useCustomSequence: false,
            controller: {
                name: 'Test',
                basePath: '/search',
                authenticate: true,
                authorizations: ['*'],
                recents: true,
            },
            models: [
                models_1.ToDo,
                {
                    model: models_1.User,
                    columns: {
                        name: 'username',
                        description: 'about',
                    },
                },
            ],
        });
        this.component(dist_1.SearchServiceComponent);
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
exports.SearchMsExampleApplication = SearchMsExampleApplication;
//# sourceMappingURL=application.js.map
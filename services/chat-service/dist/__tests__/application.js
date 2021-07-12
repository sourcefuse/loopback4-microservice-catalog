"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatApplication = void 0;
const tslib_1 = require("tslib");
const boot_1 = require("@loopback/boot");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const rest_explorer_1 = require("@loopback/rest-explorer");
const service_proxy_1 = require("@loopback/service-proxy");
const loopback4_authentication_1 = require("loopback4-authentication");
const loopback4_authorization_1 = require("loopback4-authorization");
const path = tslib_1.__importStar(require("path"));
const component_1 = require("../component");
const datasources_1 = require("../datasources");
const bearer_token_verifier_provider_1 = require("./bearer-token-verifier.provider");
const sequence_1 = require("./sequence");
class ChatApplication extends boot_1.BootMixin(service_proxy_1.ServiceMixin(repository_1.RepositoryMixin(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        // Set up default home page
        this.static('/', path.join(__dirname, '../public'));
        // // Customize @loopback/rest-explorer configuration here
        this.bind(rest_explorer_1.RestExplorerBindings.CONFIG).to({
            path: '/explorer',
        });
        this.component(rest_explorer_1.RestExplorerComponent);
        this.component(component_1.ChatServiceComponent);
        this.dataSource(datasources_1.PgdbDataSource);
        // Add authentication component
        this.component(loopback4_authentication_1.AuthenticationComponent);
        // Customize authentication verify handlers
        this.bind(loopback4_authentication_1.Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(bearer_token_verifier_provider_1.BearerTokenVerifyProvider);
        // Add authorization component
        this.bind(loopback4_authorization_1.AuthorizationBindings.CONFIG).to({
            allowAlwaysPaths: ['/explorer', '/messages'],
        });
        this.component(loopback4_authorization_1.AuthorizationComponent);
        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
            repositories: {
                dirs: ['repositories'],
                extensions: ['.repository.js'],
                nested: true,
            },
        };
    }
}
exports.ChatApplication = ChatApplication;
//# sourceMappingURL=application.js.map
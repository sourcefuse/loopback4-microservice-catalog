"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.InMailApplication = void 0;
var boot_1 = require("@loopback/boot");
var repository_1 = require("@loopback/repository");
var rest_1 = require("@loopback/rest");
var rest_explorer_1 = require("@loopback/rest-explorer");
var service_proxy_1 = require("@loopback/service-proxy");
var loopback4_authentication_1 = require("loopback4-authentication");
var loopback4_authorization_1 = require("loopback4-authorization");
var path = require("path");
var component_1 = require("../component");
var bearer_token_verifier_provider_1 = require("./bearer-token-verifier.provider");
var sequence_1 = require("./sequence");
var InMailApplication = /** @class */ (function (_super) {
    __extends(InMailApplication, _super);
    function InMailApplication(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        // Set up the custom sequence
        _this.sequence(sequence_1.MySequence);
        // Set up default home page
        _this.static('/', path.join(__dirname, '../public'));
        // // Customize @loopback/rest-explorer configuration here
        _this.bind(rest_explorer_1.RestExplorerBindings.CONFIG).to({
            path: '/explorer'
        });
        _this.component(rest_explorer_1.RestExplorerComponent);
        _this.component(component_1.InMailServiceComponent);
        // Add authentication component
        _this.component(loopback4_authentication_1.AuthenticationComponent);
        // Customize authentication verify handlers
        _this.bind(loopback4_authentication_1.Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(bearer_token_verifier_provider_1.BearerTokenVerifyProvider);
        // Add authorization component
        _this.bind(loopback4_authorization_1.AuthorizationBindings.CONFIG).to({
            allowAlwaysPaths: ['/explorer']
        });
        _this.component(loopback4_authorization_1.AuthorizationComponent);
        _this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        _this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true
            },
            repositories: {
                dirs: ['repositories'],
                extensions: ['.repository.js'],
                nested: true
            }
        };
        return _this;
    }
    return InMailApplication;
}(boot_1.BootMixin(service_proxy_1.ServiceMixin(repository_1.RepositoryMixin(rest_1.RestApplication)))));
exports.InMailApplication = InMailApplication;

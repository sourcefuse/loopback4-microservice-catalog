"use strict";
exports.__esModule = true;
exports.BearerVerifierType = exports.BearerVerifierBindings = void 0;
var context_1 = require("@loopback/context");
var globals_1 = require("./globals");
var BearerVerifierBindings;
(function (BearerVerifierBindings) {
    BearerVerifierBindings.Config = context_1.BindingKey.create(globals_1.BINDING_PREFIX + ".bearer-verfier.config");
})(BearerVerifierBindings = exports.BearerVerifierBindings || (exports.BearerVerifierBindings = {}));
var BearerVerifierType;
(function (BearerVerifierType) {
    BearerVerifierType[BearerVerifierType["service"] = 0] = "service";
    BearerVerifierType[BearerVerifierType["facade"] = 1] = "facade";
})(BearerVerifierType = exports.BearerVerifierType || (exports.BearerVerifierType = {}));

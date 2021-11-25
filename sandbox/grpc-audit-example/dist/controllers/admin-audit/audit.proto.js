"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = exports.Audit = void 0;
var Audit;
(function (Audit) {
    /**
     * @namespace Audit.Create
     * @author Jonathan Casarrubias <t: johncasarrubias>
     * @license MIT
     * @description Audit method configuration
     * from the given gRPC Audit service.
     */
    let Create;
    (function (Create) {
        Create.PROTO_NAME = 'audit.proto';
        Create.PROTO_PACKAGE = 'auditpackage';
        Create.SERVICE_NAME = 'Audit';
        Create.METHOD_NAME = 'Create';
        Create.REQUEST_STREAM = false;
        Create.RESPONSE_STREAM = false;
    })(Create = Audit.Create || (Audit.Create = {}));
})(Audit = exports.Audit || (exports.Audit = {}));
/**
 * @enum Action
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description Action enum declaration that
 * provides values from the given gRPC Action Enum.
 */
var Action;
(function (Action) {
    Action[Action["INSERT_ONE"] = 0] = "INSERT_ONE";
    Action[Action["INSERT_MANY"] = 1] = "INSERT_MANY";
    Action[Action["UPDATE_ONE"] = 2] = "UPDATE_ONE";
    Action[Action["UPDATE_MANY"] = 3] = "UPDATE_MANY";
    Action[Action["DELETE_ONE"] = 4] = "DELETE_ONE";
    Action[Action["DELETE_MANY"] = 5] = "DELETE_MANY";
})(Action = exports.Action || (exports.Action = {}));
//# sourceMappingURL=audit.proto.js.map
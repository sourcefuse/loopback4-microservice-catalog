"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONNECTORS = exports.Errors = exports.DEFAULT_RECENTS = exports.DEFAULT_COLUMNS = void 0;
exports.DEFAULT_COLUMNS = ['name', 'data'];
exports.DEFAULT_RECENTS = 5;
var Errors;
(function (Errors) {
    Errors["NO_MODELS"] = "No Models configured for SearchComponent";
    Errors["OFFSET_WITH_TYPE"] = "Offset is not allowed with limitByType option";
    Errors["OFFSET_WITHOUT_LIMIT"] = "Offset is not allowed without limit";
    Errors["TYPE_WITHOUT_LIMIT"] = "limitByType is not allowed without limit";
    Errors["INVALID_ORDER"] = "Invalid order format";
    Errors["UNSUPPORTED_CONNECTOR"] = "Unsupported Connector";
    Errors["MISSING_MATCH"] = "Missing match parameter";
    Errors["ATLEAST_ONE_CONFIG"] = "Must provide atleast one search configuration";
    Errors["NO_COLUMNS_TO_MATCH"] = "No columns for match";
    Errors["USER_MISSING"] = "User Missing while saving recent search";
    Errors["AUTHENTICATION_SETUP"] = "Must provide authentication and authorization config for controller when using default sequence";
    Errors["FAILED"] = "Unknown Failure";
    Errors["NO_RECENT"] = "No recent searches by this user";
    Errors["DB_ERROR"] = "Error while fetching data from database";
})(Errors = exports.Errors || (exports.Errors = {}));
var CONNECTORS;
(function (CONNECTORS) {
    CONNECTORS["POSTGRESQL"] = "postgresql";
    CONNECTORS["MYSQL"] = "mysql";
})(CONNECTORS = exports.CONNECTORS || (exports.CONNECTORS = {}));
//# sourceMappingURL=const.js.map
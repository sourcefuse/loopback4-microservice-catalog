"use strict";
// from here -
// https://github.com/loopbackio/loopback-next/blob/00917f5a06ea8a51e1f452f228a6b0b7314809be/packages/rest-crud/src/crud-rest.controller.ts#L129-L269
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineModelClass = exports.dynamicModelSchemaRef = exports.response = void 0;
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const assert = require("assert");
function response(statusCode, description, payload) {
    return {
        responses: {
            [`${statusCode}`]: {
                description,
                content: {
                    'application/json': payload,
                },
            },
        },
    };
}
exports.response = response;
(function (response) {
    function model(statusCode, description, modelCtor, options) {
        return response(statusCode, description, {
            schema: dynamicModelSchemaRef(modelCtor, options),
        });
    }
    response.model = model;
    function array(statusCode, description, modelCtor, options) {
        return response(statusCode, description, {
            schema: {
                type: 'array',
                items: dynamicModelSchemaRef(modelCtor, options),
            },
        });
    }
    response.array = array;
})(response = exports.response || (exports.response = {}));
function dynamicModelSchemaRef(ctor, jsonSchemaOptions) {
    return rest_1.jsonToSchemaObject(rest_1.modelToJsonSchema(ctor, jsonSchemaOptions));
}
exports.dynamicModelSchemaRef = dynamicModelSchemaRef;
function defineModelClass(base /* Model or Entity */, definition) {
    const modelName = definition.name;
    const defineNamedModelClass = () => {
        const temp = {
            [modelName]: class extends base {
            },
        };
        return temp[modelName];
    };
    const modelClass = defineNamedModelClass();
    assert.equal(modelClass.name, modelName);
    // Apply `@model(definition)` to the generated class
    repository_1.model(definition)(modelClass);
    return modelClass;
}
exports.defineModelClass = defineModelClass;
//# sourceMappingURL=utils.js.map
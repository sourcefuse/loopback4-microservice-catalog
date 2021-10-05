import { Constructor } from '@loopback/context';
import { Model, ModelDefinition } from '@loopback/repository';
import { JsonSchemaOptions, MediaTypeObject, ResponsesObject } from '@loopback/rest';
export declare function response(statusCode: number, description: string, payload: MediaTypeObject): {
    responses: ResponsesObject;
};
export declare namespace response {
    function model<T extends Model>(statusCode: number, description: string, modelCtor: Function & {
        prototype: T;
    }, options?: JsonSchemaOptions<T>): {
        responses: ResponsesObject;
    };
    function array<T extends Model>(statusCode: number, description: string, modelCtor: Function & {
        prototype: T;
    }, options?: JsonSchemaOptions<T>): {
        responses: ResponsesObject;
    };
}
export declare function dynamicModelSchemaRef<T extends object>(ctor: Function & {
    prototype: T;
}, jsonSchemaOptions?: JsonSchemaOptions<T> | undefined): import("@loopback/rest").SchemaObject | import("@loopback/rest").SchemaRef;
export declare function defineModelClass<BaseCtor extends Constructor<Model>>(base: BaseCtor, definition: ModelDefinition): typeof Model;

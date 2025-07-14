import {MetadataAccessor, MetadataInspector} from '@loopback/context';
import {
  JsonSchemaOptions,
  SchemaRef,
  getJsonSchemaRef,
  jsonToSchemaObject,
} from '@loopback/openapi-v3';

/**
 * Metadata key used to set or retrieve repository JSON Schema
 */

export const OVERRIDE_MODEL_SCHEMA_KEY = MetadataAccessor.create<
  Function,
  ClassDecorator
>('sourceloop:override-model-schema');

export function getModelSchemaRefSF<T extends object>(
  modelCtor: Function & {prototype: T},
  options?: JsonSchemaOptions<T>,
): SchemaRef {
  const cached = MetadataInspector.getClassMetadata<Function & {prototype: T}>(
    OVERRIDE_MODEL_SCHEMA_KEY,
    modelCtor,
    {
      ownMetadataOnly: true,
    },
  );
  const jsonSchema = getJsonSchemaRef(cached ?? modelCtor, options);
  return jsonToSchemaObject(jsonSchema) as SchemaRef;
}

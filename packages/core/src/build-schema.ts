import {MetadataAccessor, MetadataInspector} from '@loopback/context';
import {
  JsonSchemaOptions,
  SchemaRef,
  getJsonSchemaRef,
  jsonToSchemaObject,
} from '@loopback/openapi-v3';

/**
 * Metadata key used to set or retrieve overridden model JSON Schema.
 * This allows applications to customize model schemas at runtime.
 */
export const OVERRIDE_MODEL_SCHEMA_KEY = MetadataAccessor.create<
  Function,
  ClassDecorator
>('sourceloop:override-model-schema');

/**
 * Get model schema reference with Sourceloop-specific enhancements.
 *
 * **When to use `getModelSchemaRefSF` instead of LoopBack's `getModelSchemaRef`:**
 *
 * Use `getModelSchemaRefSF` when:
 * - Working with Sourceloop services that leverage dynamic controller/model booters
 * - Your application extends base models and needs schema validation to reflect the extended model
 * - You want to support runtime model schema overrides.
 * - Controllers need to always respect the latest model definition without code duplication
 *
 * Use LoopBack's `getModelSchemaRef` when:
 * - Working with standard LoopBack applications without Sourceloop components
 * - Model schemas are static and don't require runtime customization
 * - You don't need to support model schema overrides
 *
 * **How it works:**
 * 1. Checks if a custom schema is registered via OVERRIDE_MODEL_SCHEMA_KEY metadata
 * 2. If found, uses the overridden schema for validation
 * 3. Otherwise, falls back to the original model constructor
 * 4. Ensures schema generation is always in sync with updated model definitions
 *
 * **Example usage in controllers:**
 * ```typescript
 * import {getModelSchemaRefSF} from '@sourceloop/core';
 *
 * @post('/leads', {
 *   responses: {
 *     200: {
 *       description: 'Lead model instance',
 *       content: {
 *         'application/json': {schema: getModelSchemaRefSF(Lead)},
 *       },
 *     },
 *   },
 * })
 * async create(@requestBody() lead: Lead): Promise<Lead> {
 *   // ... implementation
 * }
 * ```
 *
 * @param modelCtor - The model constructor function
 * @param options - Optional JSON schema generation options
 * @returns Schema reference object for the model
 */
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

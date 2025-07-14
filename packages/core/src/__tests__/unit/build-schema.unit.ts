import {MetadataInspector} from '@loopback/context';
import {getModelSchemaRef, JsonSchemaOptions} from '@loopback/openapi-v3';
import {expect} from '@loopback/testlab';
import {
  getModelSchemaRefSF,
  OVERRIDE_MODEL_SCHEMA_KEY,
} from '../../build-schema'; // adjust the path accordingly

describe('getModelSchemaRefSF', () => {
  class SampleModel {
    name: string;
    age: number;
  }

  afterEach(() => {
    // Clear metadata between tests
    MetadataInspector.defineMetadata(
      OVERRIDE_MODEL_SCHEMA_KEY,
      undefined,
      SampleModel,
    );
  });

  it('returns schema ref using the original model when no override metadata is present', () => {
    const schema = getModelSchemaRefSF(SampleModel);
    const expectedSchema = getModelSchemaRef(SampleModel);
    expect(schema).to.deepEqual(expectedSchema);
  });

  it('returns schema ref using the overridden model when metadata is set', () => {
    class OverriddenModel {
      title: string;
    }

    // Set override metadata
    MetadataInspector.defineMetadata(
      OVERRIDE_MODEL_SCHEMA_KEY,
      OverriddenModel,
      SampleModel,
    );

    const schema = getModelSchemaRefSF(SampleModel);
    const expectedSchema = getModelSchemaRef(OverriddenModel);
    expect(schema).to.deepEqual(expectedSchema);
  });

  it('respects json schema options passed to the function', () => {
    const options: JsonSchemaOptions<SampleModel> = {
      title: 'CustomTitle',
      optional: ['age'],
    };

    const schema = getModelSchemaRefSF(SampleModel, options);
    const expectedSchema = getModelSchemaRef(SampleModel, options);
    expect(schema).to.deepEqual(expectedSchema);
  });
});

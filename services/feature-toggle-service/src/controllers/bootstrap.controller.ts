import {intercept} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {authorize} from 'loopback4-authorization';
import {BOOTSTRAP} from '../keys';
import {BootstrapDTO, Feature, FeatureValues} from '../models';
import {FeatureRepository, FeatureValuesRepository} from '../repositories';

const basePath = '/bootstrap';

export class BootstrapController {
  constructor(
    @repository(FeatureRepository)
    protected featuresRepository: FeatureRepository,
    @repository(FeatureValuesRepository)
    protected featureValuesRepository: FeatureValuesRepository,
  ) {}
  @intercept(BOOTSTRAP)
  @authorize({
    permissions: ['*'],
  })
  @post(`${basePath}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Bootstrap success',
      },
    },
  })
  async bootstrap(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(BootstrapDTO, {title: 'Bootstrap Request'}),
        },
      },
    })
    dto: BootstrapDTO,
    @param.header.string('x-signature') signature: string,
    @param.header.string('x-timestamp') timestamp: string,
  ): Promise<void> {
    const tenantId = dto.tenant.id;
    const feauresArray = dto.plan.features;
    const features: Feature[] = [];
    const featureValues: FeatureValues[] = [];
    for (const feature of feauresArray) {
      const featureEntity = new Feature();
      featureEntity.id = feature.id;
      featureEntity.key = feature.key;
      featureEntity.defaultValue = feature.defaultValue;
      featureEntity.name = feature.name;
      featureEntity.description = feature.description;
      featureEntity.type = feature.type;
      featureEntity.metadata = feature.metadata;
      features.push(featureEntity);

      // update the featureValues as well
      if (feature.value) {
        const featureValue: FeatureValues = feature.value;
        featureValue.strategyEntityId = tenantId;
        featureValue.strategyKey = 'Tenant';
        featureValues.push(featureValue);
      }
    }
    await this.featuresRepository.createAll(features);
    await this.featureValuesRepository.createAll(featureValues);
  }
}

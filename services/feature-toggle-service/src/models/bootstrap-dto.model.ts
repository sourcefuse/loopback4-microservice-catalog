import {AnyObject, Model, model, property} from '@loopback/repository';
import {FeaturesDTO} from './features-dto.model';

@model()
export class BootstrapDTO extends Model {
  @property({
    type: 'object',
  })
  plan: PlanDTO;

  @property({
    type: 'object',
  })
  tenant: AnyObject;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any; //NOSONAR
}

export type PlanDTO = {
  features: FeaturesDTO[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; //NOSONAR
};

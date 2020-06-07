import {property} from '@loopback/repository';
import { UserModifiableEntity } from './user-modifiable-entity.model';

export abstract class ExternalIdentifierEnabledEntity extends UserModifiableEntity {
  @property({
    type: 'string',
    name: 'ext_id',
  })
  extId?: string;

  @property({
    type: 'object',
    name: 'ext_metadata',
  })
  extMetadata?: object;
}
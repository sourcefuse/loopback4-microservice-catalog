import {SoftDeleteEntity} from 'loopback4-soft-delete';
import {property} from '@loopback/repository';

export abstract class BaseEntity extends SoftDeleteEntity {
  @property({
    type: 'date',
    default: () => new Date(),
    name: 'created_on',
  })
  createdOn?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
    name: 'modified_on',
  })
  modifiedOn?: Date;
}

import {model, property} from '@loopback/repository';
import {CoreEntity} from '../../../models';

@model()
export class TestModel extends CoreEntity<TestModel> {
  @property({
    id: true,
    type: 'string',
    generated: true,
  })
  id: string;

  @property({
    required: true,
    type: 'string',
  })
  name: string;

  @property({
    required: true,
    type: 'string',
  })
  tenantId: string;
}

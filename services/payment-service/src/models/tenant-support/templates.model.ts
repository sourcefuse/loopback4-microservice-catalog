import {model, property} from '@loopback/repository';
import {Templates as BaseTemplates} from '../templates.model';

@model({
  name: 'templates',
  settings: {strict: true},
})
export class Templates extends BaseTemplates {
  @property({
    name: 'tenant_id',
    type: 'string',
    required: true,
  })
  tenantId: string;
}

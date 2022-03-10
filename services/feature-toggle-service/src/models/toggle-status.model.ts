import {Entity, model, property} from '@loopback/repository';

@model()
export class ToggleStatus extends Entity {
  @property({
    type: 'boolean',
  })
  status: boolean;

  constructor(data?: Partial<ToggleStatus>) {
    super(data);
  }
}

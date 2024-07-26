import {Entity, model, property} from '@loopback/repository';
@model({
  name: 'archive_mapping',
})
export class ArchiveMapping extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  key: string; // filename

  @property({
    name: 'acted_on',
    type: 'string',
  })
  actedOn?: string; //Entity Name

  @property({
    type: 'object',
  })
  filter: object;

  @property({
    name: 'acted_at',
    type: 'date',
    required: true,
  })
  actedAt: Date;

  @property({
    type: 'string',
    required: true,
  })
  actor: string; // configurable

  constructor(data?: Partial<ArchiveMapping>) {
    super(data);
  }
}

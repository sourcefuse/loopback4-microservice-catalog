import {model, property} from '@loopback/repository';
import {ModelPropertyDescriptionString} from './model-property-description.enum';

@model()
export class AuthUser {
  @property({
    type: 'array',
    itemType: 'string',
    description: `This property is supposed to be a array of strings and is a required field.
      This could be empty though.`,
  })
  permissions: string[] = [];

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  role: string;

  @property({
    type: 'string',
    description: `This is a key which the consumer application need to provide
     to mark which user is performing the action.`,
    required: true,
  })
  identifier: string;

  @property({
    type: 'string',
    description: `This is an additional key which the consumer application need to provide
     to mark which user is performing the action.`,
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    description: `Email is a crucial part of this application as it is being treated
    as unique identifier in our case.`,
    required: true,
  })
  email: string;
}

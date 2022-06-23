import {model, property} from '@loopback/repository';
import {User as BaseUser} from '@sourceloop/user-tenant-service/dist/models';
console.log(BaseUser, 'baseuser');
@model({name: 'users', settings: {strict: false}})
export class User extends BaseUser {
  @property({
    type: 'string',
    required: true,
  })
  test: string;

  // Define well-known properties here

  //Indexer property to allow additional data
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
    console.log(data, 'data');
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

// // const studentDef = new ModelDefinition('Book')
// //   .addProperty('test1', {type: 'number', id: true})
// //   .addProperty('test2', {type: 'string'});
// // import DynamicModelCtor from '@loopback/repository';
// // const StudentModel = defineModelClass<
// //   typeof User,
// //   // id being provided by the base class User
// //   {university?: string}
// // >(User, studentDef);

// // const bookDef = new ModelDefinition('Book')
// //   .addProperty('id', {type: 'number', id: true})
// //   .addProperty('title', {type: 'string'});
// //    const User = new class User() = defineModelClass<typeof Entity, {id: number; title?: string}>(
// //   User, // Base model
// //   bookDef, // ModelDefinition
// // );

// // @model({settings: {strict: false}})
// // export const User = new class User().add

// // export interface UserRelations {
// //   // describe navigational properties here
// // }

// // export type UserWithRelations = User & UserRelations;

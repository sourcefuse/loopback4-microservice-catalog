/* The `export const enum ResponseDataType {` statement is defining an exported constant enum called
`ResponseDataType`. An enum is a way to define a set of named values, and in this case, the `ResponseDataType` enum
is defining different types of data. The `export` keyword makes the enum accessible outside of the
module it is defined in. The `const` keyword ensures that the enum values cannot be modified. */
export enum ResponseDataType {
  string = 'String',
  number = 'Number',
  boolean = 'Boolean',
  array = 'Array',
  object = 'Object',
  json = 'Json',
  date = 'Date',
  unknown = 'Unknown',
}

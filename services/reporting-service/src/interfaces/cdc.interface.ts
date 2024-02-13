/* The `export interface CDC {` statement is defining an interface named `CDC` and making it available
for use in other modules. The `export` keyword allows the interface to be imported and used in other
files. */

import {JSONValueType} from './json-types.interface';

export interface CDC {
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  currentValue: Record<string, JSONValueType>;
}

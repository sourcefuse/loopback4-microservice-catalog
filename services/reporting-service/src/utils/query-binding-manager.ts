import {QueryBinding} from '../interfaces/query-binding.interface';

/* eslint-disable @typescript-eslint/no-explicit-any */

export class QueryBindingManager implements QueryBinding {
  // sonarignore:start
  private bindings: Record<string, any> = {};
  // sonarignore:end
  private index = 0;

  /**
   * The `addBinding` function generates a unique key for a given value and stores it in a bindings
   * object.
   * @param {any} value - The `value` parameter in the `addBinding` method is the value that you want
   * to bind to a key in the `bindings` object. This method generates a unique key for the value and
   * adds it to the `bindings` object, returning the key with a dollar sign prefix.
   * @returns The `addBinding` method returns a string that starts with a dollar sign followed by the
   * key generated for the binding.
   */
  // sonarignore:start
  addBinding(value: any): string {
    // sonarignore:end
    const key = `param${this.index++}`;
    this.bindings[key] = value;
    return `$${key}`;
  }

  /**
   * The `getBindings` function returns the bindings stored in the object as a Record<string, any>.
   * @returns A Record<string, any> containing the bindings is being returned.
   */
  // sonarignore:start
  getBindings(): Record<string, any> {
    // sonarignore:end
    return this.bindings;
  }
}

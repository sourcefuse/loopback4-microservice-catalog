import {
  BindingScope,
  injectable,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {ProcessImportedData} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ProcessImportedDataProvider
  implements Provider<ProcessImportedData>
{
  /**Implement this provider to process and save the records do desired system
   * @param importedData - The data that is imported from the external system
   * that now needs to be processed and saved to the desired system
   */
  value(): ValueOrPromise<ProcessImportedData> {
    throw new Error('Method not implemented.');
  }
  // value(): ValueOrPromise<ProcessImportedData> {
  //   return async (importedData: AnyObject[]) => {
  //     return this.processData(importedData);
  //   };
  // }
  // async processData(importedData: AnyObject[]): Promise<void> {
  //   console.log('Processing Imported Data');
  //   console.log(importedData);
  // }
}

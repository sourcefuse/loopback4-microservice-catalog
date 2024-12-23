import {
  BindingScope,
  injectable,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {ProcessRetrievedData} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ProcessRetrievedDataProvider
  implements Provider<ProcessRetrievedData>
{
  /**Implement this provider to process and save the records do desired system
   * @param importedData - The data that is imported from the external system
   * that now needs to be processed and saved to the desired system
   */
  value(): ValueOrPromise<ProcessRetrievedData> {
    throw new Error('Process Retrieved Data not implemented.');
  }
}

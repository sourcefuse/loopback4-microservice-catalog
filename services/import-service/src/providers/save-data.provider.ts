import {Provider} from '@loopback/context';
import {MessageData, SaveDataFn} from './types';
export class SaveDataProvider implements Provider<SaveDataFn> {
  value(): SaveDataFn {
    return async (data: MessageData) => data;
  }
}

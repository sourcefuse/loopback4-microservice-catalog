import {Provider} from '@loopback/context';
import {MessageData, SaveUserDataFn} from './types';
export class SaveUserDataProvider implements Provider<SaveUserDataFn> {
  value(): SaveUserDataFn {
    return async (data: MessageData) => data;
  }
}

import {BindingKey, CoreBindings} from '@loopback/core';
import {ImportServiceComponent} from './component';
import {IUploader, SaveDataFn} from './providers/types';
import {MessageData} from './types';

/**
 * Binding keys used by this component.
 */
export namespace ImportServiceComponentBindings {
  export const COMPONENT = BindingKey.create<ImportServiceComponent>(
    `${CoreBindings.COMPONENTS}.ImportServiceComponent`,
  );
}
export namespace ImportServiceBindings {
  export const SendMessageProvider = BindingKey.create<
    (data: MessageData[]) => Promise<void>
  >(`importService.sendMessage.provider`);
  export const ReceiveMessageListenerProvider = BindingKey.create<() => void>(
    `importService.receiveMessageListener.provider`,
  );
  export const SaveDataProvider = BindingKey.create<SaveDataFn>(
    'importService.google.saveDataProvider',
  );
}
export namespace FileUploadBindings {
  export const MulterS3Provider = BindingKey.create<IUploader>(
    'importService.multer.s3',
  );
  export const SafeMulterS3Provider = BindingKey.create<IUploader>(
    'importService.safe-multer-s3',
  );
}

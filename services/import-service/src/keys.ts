import {BindingKey, CoreBindings} from '@loopback/core';
import {ImportServiceComponent} from './component';
import {IUploader, SaveUserDataFn} from './providers/types';
import {MessageData} from './types';

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
  export const SaveUserDataProvider = BindingKey.create<SaveUserDataFn>(
    'importService.saveUserDataProvider',
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

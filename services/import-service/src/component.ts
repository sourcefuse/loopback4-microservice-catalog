import {
  Application,
  injectable,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
  ProviderMap,
  Binding,
  ControllerClass,
} from '@loopback/core';
import {CoreComponent} from '@sourceloop/core';
import {Class, Model, Repository} from '@loopback/repository';
import {FileUploadController} from './controllers/file-upload.controller';
import {ImportController} from './controllers/import.controller';
import {ImportServiceBindings, ImportServiceComponentBindings} from './keys';
import {ReceiveMessageListenerObserver} from './observers/start-receive-message.observer';
import {ReceiveMessageListenerProvider} from './providers/receive-message-listener.provider';
import {SaveUserDataProvider} from './providers/save-data.provider';
import {SendMessageProvider} from './providers/send-message.provider';
import {ExcelService} from './services/excel.service';
import {FileHelperService} from './services/file-helper.service';
import {
  DEFAULT_IMPORT_SERVICE_OPTIONS,
  ImportServiceComponentOptions,
} from './types';

@injectable({
  tags: {[ContextTags.KEY]: ImportServiceComponentBindings.COMPONENT},
})
export class ImportServiceComponent implements Component {
  repositories?: Class<Repository<Model>>[];
  models?: Class<Model>[];
  controllers?: ControllerClass[];

  bindings?: Binding[] = [];
  providers?: ProviderMap = {};
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @config()
    private configuration: ImportServiceComponentOptions = DEFAULT_IMPORT_SERVICE_OPTIONS,
  ) {
    this.bindings = [];
    this.models = [];
    // Mount core component
    this.application.component(CoreComponent);
    this.providers = {
      [ImportServiceBindings.ReceiveMessageListenerProvider.key]:
        ReceiveMessageListenerProvider,
      [ImportServiceBindings.SaveUserDataProvider.key]: SaveUserDataProvider,
      [ImportServiceBindings.SendMessageProvider.key]: SendMessageProvider,
    };

    this.bindings.push(
      this.application.bind('services.ExcelService').toClass(ExcelService),
      this.application
        .bind('services.ExcelCsvHelperService')
        .toClass(FileHelperService),
    );
    if (configuration?.initObservers) {
      this.application.lifeCycleObserver(ReceiveMessageListenerObserver);
    } else if (configuration?.controllers) {
      this.controllers = [FileUploadController, ImportController];
    } else {
      // do nothing.
    }
  }
}

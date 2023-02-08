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
import {SaveDataProvider} from './providers/save-data.provider';
import {SendMessageProvider} from './providers/send-message.provider';
import {ExcelService} from './services/excel.service';
import {FileHelperService} from './services/file-helper.service';
import {
  DEFAULT_IMPORT_SERVICE_OPTIONS,
  ImportServiceComponentOptions,
} from './types';
//import {AWSS3Bindings, AwsS3Component} from 'loopback4-s3';

@injectable({
  tags: {[ContextTags.KEY]: ImportServiceComponentBindings.COMPONENT},
})
export class ImportServiceComponent implements Component {
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  /**
   * An array of controller classes
   */
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
    // this.bind(AWSS3Bindings.Config).to({
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //   region: process.env.AWS_REGION,
    // } as AwsS3Config);
    // this.component(AwsS3Component);

    this.providers = {
      [ImportServiceBindings.ReceiveMessageListenerProvider.key]:
        ReceiveMessageListenerProvider,
      [ImportServiceBindings.SaveDataProvider.key]: SaveDataProvider,
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

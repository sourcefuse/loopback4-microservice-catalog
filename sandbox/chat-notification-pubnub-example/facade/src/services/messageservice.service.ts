import {inject, Provider} from '@loopback/core';
import {Filter, Where} from '@loopback/repository';
import {getService} from '@loopback/service-proxy';
import {MessageDataSource} from '../datasources';
import {PubnubMessage, PubnubMessageRecipient} from '../models';

export interface Messageservice {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getMessage(
    token: string,
    filter?: Filter<PubnubMessage>,
  ): Promise<PubnubMessage[]>;
  createMessage(data: PubnubMessage, token: string): Promise<PubnubMessage>;

  getMessageRecipients(
    token: string,
    filter?: Filter<PubnubMessageRecipient>,
  ): Promise<PubnubMessageRecipient>[];
  createMessageRecipients(
    data: PubnubMessageRecipient,
    token: string,
  ): Promise<PubnubMessageRecipient>;
  updateMsgRecipients(
    id: string,
    data: Partial<PubnubMessageRecipient>,
    token: string,
    where?: Where<PubnubMessageRecipient>,
  ): Promise<PubnubMessageRecipient>;
}

export class MessageserviceProvider implements Provider<Messageservice> {
  constructor(
    // message must match the name property in the datasource json file
    @inject('datasources.message')
    protected dataSource: MessageDataSource = new MessageDataSource(),
  ) {}

  value(): Promise<Messageservice> {
    return getService(this.dataSource);
  }
}

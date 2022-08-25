// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/core';
import {Filter, Where} from '@loopback/repository';
import {getService} from '@loopback/service-proxy';
import {MessageDataSource} from '../datasources';
import {SocketMessage, SocketMessageRecipient} from '../models';

export interface Messageservice {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getMessage(
    token: string,
    filter?: Filter<SocketMessage>,
  ): Promise<SocketMessage[]>;
  createMessage(data: SocketMessage, token: string): Promise<SocketMessage>;

  getMessageRecipients(
    token: string,
    filter?: Filter<SocketMessageRecipient>,
  ): Promise<SocketMessageRecipient>[];
  createMessageRecipients(
    data: SocketMessageRecipient,
    token: string,
  ): Promise<SocketMessageRecipient>;
  updateMsgRecipients(
    id: string,
    data: Partial<SocketMessageRecipient>,
    token: string,
    where?: Where<SocketMessageRecipient>,
  ): Promise<SocketMessageRecipient>;
}

export class MessageserviceProvider implements Provider<Messageservice> {
  constructor(
    // message must match the name property in the datasource json file
    @inject('datasources.message')
    protected dataSource: MessageDataSource = new MessageDataSource(), //NOSONAR
  ) {}

  value(): Promise<Messageservice> {
    return getService(this.dataSource);
  }
}

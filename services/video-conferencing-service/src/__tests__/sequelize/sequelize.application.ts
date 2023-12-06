// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {SequelizeDataSource} from '@loopback/sequelize';
import * as path from 'path';
import {VideoConfServiceComponent} from '../../component';
import {VideoChatBindings} from '../../keys';
import {VonageBindings} from '../../providers';
import {TwilioBindings} from '../../providers/twilio';

export {ApplicationConfig};

export class VideoConfServiceApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));
    this.bind(VideoChatBindings.Config).to({
      useCustomSequence: false,
      useSequelize: true,
    });
    this.bind(TwilioBindings.config).to({
      accountSid: 'ACCOUNTS_ID',
      authToken: 'AUTH_TOKEN',
      apiSid: 'API_ID',
      apiSecret: 'API_SECRET',
    });
    this.bind(VonageBindings.config).to({
      apiKey: 'API_KEY',
      apiSecret: 'API_SECRET',
      timeToStart: 300,
    });
    this.component(VideoConfServiceComponent);
    const ds = new SequelizeDataSource({
      name: 'videochatDb',
      connector: 'sqlite3',
      file: ':memory:',
      database: 'test',
    });

    this.bind(`datasources.videochatDb`).to(ds);

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers/sequelize'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}

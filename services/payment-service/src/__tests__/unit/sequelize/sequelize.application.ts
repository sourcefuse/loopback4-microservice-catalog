import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {SequelizeDataSource} from '@loopback/sequelize';
import * as path from 'path';
import {PaymentServiceComponent} from '../../../component';
import {PaymentServiceBindings} from '../../../keys';

export {ApplicationConfig};

export class SequelizePaymentApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));
    this.bind(PaymentServiceBindings.Config).to({
      useCustomSequence: false,
      useSequelize: true,
    });
    this.component(PaymentServiceComponent);
    const ds = new SequelizeDataSource({
      name: 'PaymentSourceName',
      connector: 'sqlite3',
      file: ':memory:',
      database: 'test',
    });

    this.bind(`datasources.payment`).to(ds);
    this.bind('rest.http.response').to('');
    this.bind('rest.http.request').to({
      query: {
        method: 'stripe',
      },
    });
    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}

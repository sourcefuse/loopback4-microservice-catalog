import {Provider, inject} from '@loopback/core';
import {Dialect, Sequelize} from 'sequelize';
import {SequelizeDataStoreConfiguration} from '../../interfaces';
import {ReportingServiceComponentBindings} from '../../keys';

export class SequelizeObjectProvider implements Provider<Sequelize> {
  constructor(
    @inject(ReportingServiceComponentBindings.DATA_STORE_CONFIGURATION)
    private readonly config: SequelizeDataStoreConfiguration,
  ) {}
  value(): Sequelize {
    return new Sequelize({
      dialect: this.config.databaseType as Dialect,
      host: this.config.host,
      port: this.config.port,
      username: this.config.username,
      password: this.config.password,
      database: this.config.database,
    });
  }
}

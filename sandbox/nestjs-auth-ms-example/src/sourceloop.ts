import { RestApplication } from '@loopback/rest';
import { AuthenticationServiceApplication } from '@sourceloop/authentication-service/dist/application';
import { juggler } from '@loopback/repository';

export class SourceLoop {
  services: {
    swaggerPath: string;
    appInstance: RestApplication;
    reservedPaths: string[];
    boot: () => Promise<void>;
  }[] = [];
  private _reservedPaths: string[];

  protected setUpAuthService() {
    const authService = new AuthenticationServiceApplication({
      rest: {
        listenOnStart: false,
      },
    });

    const authDb = new juggler.DataSource({
      name: 'AuthDB',
      connector: 'postgresql',
      host: process.env.AUTHDB_HOST,
      port: process.env.AUTHDB_PORT,
      user: process.env.AUTHDB_USER,
      password: process.env.AUTHDB_PSWD,
      database: process.env.AUTHDB_DB,
      schema: process.env.AUTHDB_SCHEMA,
    });

    const authCache = new juggler.DataSource({
      name: 'AuthCache',
      connector: 'kv-memory',
    });

    authService.dataSource(authDb);
    authService.dataSource(authCache);
    return authService;
  }
  constructor() {
    this.services.push({
      swaggerPath: 'auth',
      appInstance: this.setUpAuthService(),
      reservedPaths: ['/auth/*', '/keycloak/logout', '/logout'],
      boot: async function () {
        await this.appInstance.boot();
        await this.appInstance.start();
      },
    });
  }

  get reservedPaths() {
    this._reservedPaths = [];
    for (const service of global.sourceloop.services) {
      this._reservedPaths.push(...service.reservedPaths);
    }
    return this._reservedPaths;
  }
}

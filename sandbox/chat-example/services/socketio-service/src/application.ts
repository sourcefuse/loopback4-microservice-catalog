// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {SocketIoApplication, SocketIoServer} from '@loopback/socketio';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import * as prometheus from 'socket.io-prometheus-metrics';
import {SocketIoController} from './controllers';

export {ApplicationConfig};

export class SocketIoExampleApplication extends BootMixin(SocketIoApplication) {
  readonly ioServer: SocketIoServer;

  constructor(options: ApplicationConfig = {}) {
    const port = 3000;
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: true,
      includeProcessEnv: true,
    });
    options.httpServerOptions = options.httpServerOptions ?? {};
    options.httpServerOptions.basePath = process.env.BASE_PATH ?? '';
    options.httpServerOptions.port = +(process.env.PORT ?? port);
    options.httpServerOptions.host = process.env.HOST;

    options.socketIoOptions.path = `${process.env.BASE_PATH ?? ''}/socket.io`;

    super(options);

    this.projectRoot = __dirname;

    if (!!+(process.env.ENABLE_PROMETHEUS || 0)) {
      // sonarignore:start
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prometheus.metrics((this.socketServer as any).io, {
        // sonarignore:end
        collectDefaultMetrics: !!+(
          process.env.COLLECT_PROM_DEFAULT_METRICS ?? 0
        ),
      });
    }
    this.socketServer.use((socket, next) => {
      next();
    });

    const ns = this.socketServer.route(SocketIoController);
    ns.use((socket, next) => {
      next();
    });
  }
}

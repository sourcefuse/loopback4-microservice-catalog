// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ApplicationConfig, SocketIoExampleApplication} from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new SocketIoExampleApplication(options);
  await app.boot();
  await app.start();

  const url = app.socketServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

const port = 3000;
if (require.main === module) {
  // Run the application
  const config = {
    httpServerOptions: {
      host: process.env.HOST,
      port: +(process.env.PORT ?? port),
      basePath: process.env.BASE_PATH ?? '',
    },
    socketIoOptions: {
      path: `${process.env.BASE_PATH ?? ''}/socket.io`,
    },
  };

  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}

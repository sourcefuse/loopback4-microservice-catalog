// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @sourceloop/example-socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {SocketIoExampleApplication} from './application';

// sonarignore:start
export async function migrate(args: string[]) {
  // sonarignore:end
  const app = new SocketIoExampleApplication();
  await app.boot();

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err); //NOSONAR
  process.exit(1);
});

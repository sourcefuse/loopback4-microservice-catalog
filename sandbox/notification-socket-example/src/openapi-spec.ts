// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ApplicationConfig} from '@loopback/core';
import {NotificationSocketExampleApplication} from './application';

/**
 * Export the OpenAPI spec from the application
 */

const port = 3000;
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? port),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const app = new NotificationSocketExampleApplication(config);
  await app.boot();
}

exportOpenApiSpec().catch(err => {
  console.error('Fail to export OpenAPI spec from the application.', err); //NOSONAR
  process.exit(1);
});

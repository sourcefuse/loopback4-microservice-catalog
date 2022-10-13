// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ApplicationConfig} from '@loopback/core';
import {CacheExampleApplication} from './application';

const defaultPort = 3000;
/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? defaultPort),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const fileIndex = 2;
  const outFile = process.argv[fileIndex] ?? '';
  const app = new CacheExampleApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch(err => {
  process.exit(1);
});

﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ApplicationConfig} from '@loopback/core';
import {WorkflowServiceApplication} from './application';

/**
 * Export the OpenAPI spec from the application
 */
const PORT = 3000;
const FILEARGVI = 2;
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? PORT),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const outFile = process.argv[FILEARGVI] ?? 'openapi.json';
  const app = new WorkflowServiceApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch(err => {
  console.error('Fail to export OpenAPI spec from the application.', err); //NOSONAR
  process.exit(1);
});

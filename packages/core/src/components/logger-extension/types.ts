// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// Types and interfaces exposed by the extension go here

import {Request, OperationArgs} from '@loopback/rest';

/**
 * A function to perform REST req/res logging action
 */
export type LogFn = (
  req: Request,
  args: OperationArgs,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  result: any, // NOSONAR
) => Promise<void>;

export interface LogMessage {
  key?: string;
  message: string;
  level: number;
  timestamp?: Date;
}

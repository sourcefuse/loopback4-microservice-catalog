// Types and interfaces exposed by the extension go here

import {Request, OperationArgs} from '@loopback/rest';

/**
 * A function to perform REST req/res logging action
 */
export interface LogFn {
  (
    req: Request,
    args: OperationArgs,
    // sonarignore:start
    /* eslint-disable @typescript-eslint/no-explicit-any */
    result: any,
  ): // sonarignore:end
  Promise<void>;
}

export interface LogMessage {
  key?: string;
  message: string;
  level: number;
  timestamp?: Date;
}

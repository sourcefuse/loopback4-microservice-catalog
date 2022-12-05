// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// Types and interfaces exposed by the extension go here

import {Request, OperationArgs} from '@loopback/rest';

/**
 * @param {LogFn} LogFn A function to perform REST req/res logging action.
 * @return returning values req,args,result.
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

/**
 * @param {LogMessage} - exporting interface `LogMessage`.
 * @return returning values of properties key,message,level,timestamp.
 */
export interface LogMessage {
  key?: string;
  message: string;
  level: number;
  timestamp?: Date;
}

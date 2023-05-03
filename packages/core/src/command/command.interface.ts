// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICommand {
  parameters?: any;
  execute(): Promise<any>;
}

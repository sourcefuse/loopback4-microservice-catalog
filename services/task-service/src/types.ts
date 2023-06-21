// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable  @typescript-eslint/naming-convention */

export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

export interface EventQueueConnector {
  name: string;
  settings: {[key: string]: any};
  connect(settings: {[key: string]: any}): Promise<any>;
  disconnect(settings: {[key: string]: any}): Promise<any>;
  ping(): Promise<any>;
}

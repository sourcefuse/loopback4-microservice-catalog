// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DataObject} from '@loopback/repository';

export interface IReporting {
  getQueryData(
    queryId: string | undefined,
    userRole: string,
  ): Promise<string | DataObject<{}>>;
}

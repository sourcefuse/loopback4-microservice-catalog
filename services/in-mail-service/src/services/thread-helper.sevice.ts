// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, injectable} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';

import {Options} from '@loopback/repository/src/common-types';
import {Thread} from '../models';
import {ThreadRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class ThreadHelperService {
  constructor(
    @repository(ThreadRepository)
    public threadRepository: ThreadRepository,
  ) {}

  async incrementOrCreate(
    id: typeof Thread.prototype.id | undefined,
    entity: DataObject<Thread>,
    options?: Options,
  ) {
    if (!id) {
      return this.threadRepository.create(entity, options);
    }
    const thread = await this.threadRepository.findById(id);
    if (!thread) {
      return this.threadRepository.create(entity, options);
    }
    await this.threadRepository.updateById(
      id,
      {messageCounts: thread.messageCounts + 1},
      options,
    );
    return thread;
  }
}

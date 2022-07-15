// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {ICommand} from '@sourceloop/core';

export class TestBpmnCommand implements ICommand {
  parameters: AnyObject;

  async execute() {
    const finish = this.parameters.finish;
    finish();
  }
}

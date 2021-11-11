import {AnyObject} from '@loopback/repository';
import {ICommand} from '@sourceloop/core';

export class TestBpmnCommand implements ICommand {
  parameters: AnyObject;

  async execute() {
    const finish = this.parameters.finish;
    finish();
  }
}

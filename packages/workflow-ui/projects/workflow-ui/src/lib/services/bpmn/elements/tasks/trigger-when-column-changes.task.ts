import {Inject, Injectable} from '@angular/core';
import {CreateStrategy, LinkStrategy} from '../../../../interfaces';
import {ModdleElement} from '../../../../types/bpmn.types';
import {UtilsService} from '../../../utils.service';
import {CREATE_TASK_STRATEGY} from '../../strategies/create';
import {LINK_BASIC_STRATEGY} from '../../strategies/link';
import {ServiceTaskElement} from './service-task.task';

@Injectable()
export class TriggerWhenColumnChanges extends ServiceTaskElement {
  constructor(
    @Inject(CREATE_TASK_STRATEGY)
    protected creator: CreateStrategy<ModdleElement>,
    @Inject(LINK_BASIC_STRATEGY)
    protected linker: LinkStrategy<ModdleElement>,
    public utils: UtilsService,
  ) {
    super();
    this.attributes = {
      ...this.attributes,
      'camunda:topic': 'trigger-on-tcv-change-dev',
    };
  }
  name = 'trigger when column value changes';
  properties = {};
  inputs = {
    name: 'pathParams',
    fields: {
      groupColumnId: {
        state: 'column',
      },
    },
  };
  outputs = 'outputVariable';
}

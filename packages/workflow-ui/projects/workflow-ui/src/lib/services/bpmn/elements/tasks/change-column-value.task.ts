import {Inject, Injectable} from '@angular/core';
import {State} from '../../../../classes';
import {ENV, RecordOfAnyType} from '../../../../types';
import {CreateStrategy, LinkStrategy} from '../../../../interfaces';
import {ModdleElement} from '../../../../types/bpmn.types';
import {UtilsService} from '../../../utils.service';
import {CREATE_TASK_STRATEGY} from '../../strategies/create';
import {LINK_BASIC_STRATEGY} from '../../strategies/link';
import {ServiceTaskElement} from './service-task.task';
import {ENV_TOKEN} from '../../../../token';

@Injectable()
export class ChangeColumnValue extends ServiceTaskElement {
  constructor(
    @Inject(CREATE_TASK_STRATEGY)
    protected creator: CreateStrategy<ModdleElement>,
    @Inject(LINK_BASIC_STRATEGY)
    protected linker: LinkStrategy<ModdleElement>,
    @Inject(ENV_TOKEN) protected env: ENV,
    public utils: UtilsService,
  ) {
    super();
    this.attributes = {
      ...this.attributes,
      'camunda:topic': `change-task-column-value-${this.env?.envIdentifier}`,
    };
  }
  name = 'change column value';
  properties = {};
  inputs = {
    name: 'pathParams',
    fields: {
      taskIds: {
        from: 'taskIds',
      },
      groupColumnId: {
        state: 'column',
      },
      boardId: {
        state: 'boardId',
      },
      changedValue: {
        formatter: <S extends RecordOfAnyType>(state: State<S>) => {
          if (typeof state.get('value') === 'object') {
            return `'${JSON.stringify(state.get('value'))}'`;
          }
          return `'{"displayValue": "${
            state.get('valueName') ?? state.get('value')
          }", "value": "${state.get('value')}"}'`;
        },
      },
    },
  };
  outputs = 'outputVariable';
}

import {StateMap} from '../../types/base.types';
import {WorkflowAction} from '../nodes/abstract-workflow-action.class';
import {WorkflowEvent} from '../nodes/abstract-workflow-event.class';
import {Statement} from '../statement/statement.class';

export abstract class BuilderService<E, S> {
  abstract build(statement: Statement<E>): Promise<string>;
  abstract restore(model: string): Promise<{
    actions: WorkflowAction<E>[];
    events: WorkflowEvent<E>[];
    state: StateMap<S>;
    process: E & {id: string};
  }>;
}

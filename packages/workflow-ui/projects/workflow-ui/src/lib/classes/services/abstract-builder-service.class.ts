import {StateMap, ActionWithInput, EventWithInput} from '../../types/base.types';
import {BaseGroup} from '../nodes/abstract-base-group.class';
import {Statement} from '../statement/statement.class';

export abstract class BuilderService<E, S> {
  abstract build(statement: Statement<E>, elseStatement: Statement<E>): Promise<string>;
  abstract restore(model: string): Promise<{
    actions: ActionWithInput<E>[];
    elseActions: ActionWithInput<E>[];
    events: EventWithInput<E>[];
    groups: BaseGroup<E>[];
    state: StateMap<S>;
    process: E & { id: string };
  }>;
}

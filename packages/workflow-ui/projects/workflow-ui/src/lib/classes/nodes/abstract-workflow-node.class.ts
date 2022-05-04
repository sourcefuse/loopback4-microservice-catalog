import {Constructor, RecordOfAnyType} from '../../types';
import {WorkflowElement} from '../element/abstract-element.class';
import {State} from '../state';
import {WorkflowPrompt} from './abstract-prompt.class';

export abstract class WorkflowNode<E> {
  abstract elements: Constructor<WorkflowElement<E>>[];
  abstract statement: string;
  abstract prompts: Constructor<WorkflowPrompt>[];
  abstract state: State<RecordOfAnyType>;
  abstract name: string;
  id: string;
}

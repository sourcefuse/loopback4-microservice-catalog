import {WorkflowPrompt} from '..';
import {Constructor, WorkflowNode} from '../../types/base.types';

export abstract class NodeService<E> {
  abstract getActions(): WorkflowNode<E>[];
  abstract getEvents(trigger?: boolean): WorkflowNode<E>[];
  abstract getNodeByName(name: string, id?: string): WorkflowNode<E>;
  abstract mapInputs(prompts: Constructor<WorkflowPrompt>[]): WorkflowPrompt[];
}

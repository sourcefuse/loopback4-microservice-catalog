import { WorkflowPrompt } from '..';
import { NodeTypes } from '../../enum';
import { Constructor, WorkflowNode } from '../../types/base.types';
import { BaseGroup } from '../nodes/abstract-base-group.class';

export abstract class NodeService<E> {
  abstract getActions(): WorkflowNode<E>[];
  abstract getEvents(trigger?: boolean): WorkflowNode<E>[];
  abstract getGroups(trigger?: boolean, type?: NodeTypes): BaseGroup<E>[];
  abstract getNodeByName(name: string, id?: string): WorkflowNode<E>;
  abstract mapInputs(prompts: Constructor<WorkflowPrompt>[]): WorkflowPrompt[];
}

import { WorkflowPrompt } from '..';
import { NodeTypes } from '../../enum';
import { Constructor, WorkflowNode } from '../../types/base.types';
import { BaseGroup } from '../nodes/abstract-base-group.class';

export abstract class NodeService<E> {
  abstract getActions(): WorkflowNode<E>[];
  abstract getEvents(trigger?: boolean): WorkflowNode<E>[];
  abstract getGroups(trigger?: boolean, type?: NodeTypes, isElseGroup?: boolean): BaseGroup<E>[];
  abstract getNodeByName(name: string, groupType: string, groupId: string, id?: string, isElseAction?: boolean): WorkflowNode<E>;
  abstract getGroupByName(name: string, nodeType: NodeTypes, id?: string): BaseGroup<E>;
  abstract mapInputs(prompts: Constructor<WorkflowPrompt>[]): WorkflowPrompt[];
}

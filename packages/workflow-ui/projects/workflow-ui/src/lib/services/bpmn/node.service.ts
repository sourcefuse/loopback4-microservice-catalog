import { Inject, Injectable } from '@angular/core';
import {
  WorkflowAction,
  WorkflowEvent,
  WorkflowPrompt,
} from '../../classes/nodes';
import { NodeService } from '../../classes/services';
import { BPMN_INPUTS, BPMN_NODES } from '../../const';
import { NodeTypes } from '../../enum';
import { InvalidEntityError } from '../../errors/base.error';
import { BaseGroup, BpmnNodePrompt, Constructor, WorkflowNode } from '../../types';
import { UtilsService } from '../utils.service';
@Injectable()
export class BpmnNodesService<E> extends NodeService<E> {
  actions = new Map<string, Constructor<WorkflowAction<E>>>();
  events = new Map<string, Constructor<WorkflowEvent<E>>>();
  constructor(
    @Inject(BPMN_NODES)
    private readonly nodes: Constructor<WorkflowNode<E>>[],
    @Inject(BPMN_NODES)
    private readonly groups: Constructor<BaseGroup<E>>[],
    @Inject(BPMN_INPUTS)
    private readonly inputs: BpmnNodePrompt[],
    private readonly utils: UtilsService,
  ) {
    super();
  }

  getActions() {
    return this.nodes
      .map(Node => new Node(this.utils.uuid()))
      .filter(n => n.type === NodeTypes.ACTION);
  }

  getEvents(trigger = false) {
    return this.nodes
      .map(Node => new Node(this.utils.uuid()))
      .filter(n => n.type === NodeTypes.EVENT)
      .filter(instance => trigger === (instance as WorkflowEvent<E>).trigger);
  }

  getGroups(trigger = false, type = NodeTypes.EVENT) {
    if (trigger) {
      return this.groups
        .map(Group => new Group(type))
        .filter(n => n.type === NodeTypes.GROUP)
        .filter(instance => trigger === instance.trigger);
    } else {
      return this.groups
        .map(Group => new Group(type))
        .filter(n => n.type === NodeTypes.GROUP);
    }
  }

  getNodeByName(name: string, id?: string) {
    const ctor = this.nodes.find(n => n.name === name);
    if (!id) {
      id = this.utils.uuid();
    }
    if (!ctor) {
      throw new InvalidEntityError(name);
    }
    return new ctor(id);
  }

  mapInputs(prompts: typeof WorkflowPrompt[]) {
    return prompts.map(input => {
      const inputInstance = this.inputs.find(
        i => i.constructor.name === input.name,
      );
      if (!inputInstance) {
        throw new InvalidEntityError(input.name);
      }
      return inputInstance;
    });
  }
}

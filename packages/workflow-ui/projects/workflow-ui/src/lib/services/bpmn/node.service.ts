import {Inject, Injectable} from '@angular/core';
import {
  WorkflowAction,
  WorkflowEvent,
  WorkflowPrompt,
} from '../../classes/nodes';
import {NodeService} from '../../classes/services';
import {BPMN_INPUTS, BPMN_NODES} from '../../const';
import {NodeTypes} from '../../enum';
import {InvalidEntityError} from '../../errors/base.error';
import {BpmnNodePrompt, Constructor, WorkflowNode} from '../../types';
import {UtilsService} from '../utils.service';
@Injectable()
export class BpmnNodesService<E> extends NodeService<E> {
  actions = new Map<string, Constructor<WorkflowAction<E>>>();
  events = new Map<string, Constructor<WorkflowEvent<E>>>();
  constructor(
    @Inject(BPMN_NODES)
    private readonly nodes: Constructor<WorkflowNode<E>>[],
    @Inject(BPMN_INPUTS)
    private readonly inputs: BpmnNodePrompt[],
    private readonly utils: UtilsService,
  ) {
    super();
  }

  /**
   * > Get all the nodes that are of type `ACTION`
   *
   * The function is a bit more complicated than that, but that's the gist of it
   * @returns An array of action nodes.
   */
  getActions() {
    return this.nodes
      .map(Node => new Node(this.utils.uuid()))
      .filter(n => n.type === NodeTypes.ACTION);
  }

  /**
   * > Get all the nodes that are events, and if the trigger parameter is true, only get the ones that
   * are triggers
   * @param [trigger=false] - boolean - If true, only return events that are triggers. If false, only
   * return events that are not triggers.
   * @returns An array of WorkflowEvent<E> instances.
   */
  getEvents(trigger = false) {
    return this.nodes
      .map(Node => new Node(this.utils.uuid()))
      .filter(n => n.type === NodeTypes.EVENT)
      .filter(instance => trigger === (instance as WorkflowEvent<E>).trigger);
  }

  /**
   * "Given a name, return a new instance of the node with that name."
   *
   * @param {string} name - The name of the node you want to create.
   * @param {string} [id] - The id of the node. If not provided, a uuid will be generated.
   * @returns A new instance of the node class.
   */
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

  /**
   * It takes an array of prompts, and returns an array of inputs
   * @param prompts - typeof WorkflowPrompt[]
   * @returns An array of input instances.
   */
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

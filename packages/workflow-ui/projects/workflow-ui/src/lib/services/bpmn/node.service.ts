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
import {
  BaseGroup,
  BpmnNodePrompt,
  Constructor,
  WorkflowNode,
} from '../../types';
import {UtilsService} from '../utils.service';
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
   * > Get all the events from the nodes array, filter out the ones that are not of type `EVENT` and
   * then filter out the ones that are not triggers
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
   * It returns an array of groups, each of which is a new instance of the Group class, with a unique
   * ID, and the type and isElseGroup parameters passed in
   * @param [trigger=false] - The trigger to filter by. If not provided, all groups will be returned.
   * @param type - The type of node you want to get.
   * @param [isElseGroup=false] - This is a boolean value that determines whether the group is an else
   * group or not.
   * @returns An array of groups
   */
  getGroups(trigger = false, type = NodeTypes.EVENT, isElseGroup = false) {
    if (trigger) {
      return this.groups
        .map(Group => new Group(this.utils.uuid(), type, isElseGroup))
        .filter(n => n.type === NodeTypes.GROUP)
        .filter(instance => trigger === instance.trigger);
    } else {
      return this.groups
        .map(Group => new Group(this.utils.uuid(), type, isElseGroup))
        .filter(n => n.type === NodeTypes.GROUP);
    }
  }

  /**
   * It takes a string, and returns a new instance of a class that has a name property that matches the
   * string
   * @param {string} name - The name of the node.
   * @param {string} groupName - The name of the group that the node belongs to.
   * @param {string} groupId - The id of the group that the node belongs to.
   * @param {string} [id] - The id of the node. If not provided, a new id will be generated.
   * @param {boolean} [isElseAction] - If the node is an else action, it will be set to true.
   * @returns A new instance of the node class that matches the name passed in.
   */
  getNodeByName(
    name: string,
    groupName: string,
    groupId: string,
    id?: string,
    isElseAction?: boolean,
  ) {
    const ctor = this.nodes.find(n => n.name === name);
    if (!id) {
      id = this.utils.uuid();
    }
    if (!ctor) {
      throw new InvalidEntityError(name);
    }
    return new ctor(id, groupName, groupId, isElseAction);
  }

  /**
   * It takes a name, a node type, an id, and a boolean, and returns a new instance of a class that
   * extends BaseGroup
   * @param {string} name - The name of the group you want to create.
   * @param {NodeTypes} nodeType - The type of node. This is used to determine the type of node to
   * create.
   * @param {string} [id] - The id of the group.
   * @param {boolean} [isElseGroup] - This is a boolean value that indicates whether the group is an
   * else group.
   * @returns A new instance of the group class that matches the name passed in.
   */
  getGroupByName(
    name: string,
    nodeType: NodeTypes,
    id?: string,
    isElseGroup?: boolean,
  ): BaseGroup<E> {
    const ctor = this.groups.find(n => n.name === name);
    if (!id) {
      id = this.utils.uuid();
    }
    if (!ctor) {
      throw new InvalidEntityError(name);
    }
    return new ctor(id, nodeType, isElseGroup);
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

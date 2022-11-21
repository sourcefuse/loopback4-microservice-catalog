import { BaseGroup } from "../../../classes/nodes/abstract-base-group.class";
import { NodeTypes } from "../../../enum";

export class OrGroup<E> extends BaseGroup<E> {
  isElseGroup = false;
  type = NodeTypes.GROUP;
  children = [];
  trigger = false;
  name = 'or';
  nodeType: NodeTypes;
  constructor(id: string, type: NodeTypes) {
    super();
    this.nodeType = type;
    this.id = id;
  }
}

import { BaseGroup } from "../../../classes/nodes/abstract-base-group.class";
import { NodeTypes } from "../../../enum";

export class AndGroup<E> extends BaseGroup<E> {
  isElseGroup: boolean;
  type = NodeTypes.GROUP;
  children = [];
  trigger = true;
  name = 'and';
  nodeType: NodeTypes;
  constructor(id: string, type: NodeTypes, isElseGroup?: boolean) {
    super();
    this.nodeType = type;
    this.id = id;
    this.isElseGroup = isElseGroup || false;
  }
}

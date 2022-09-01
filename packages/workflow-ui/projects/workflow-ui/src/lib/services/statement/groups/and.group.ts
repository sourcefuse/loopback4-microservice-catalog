import { BaseGroup } from "../../../classes/nodes/abstract-base-group.class";
import { NodeTypes } from "../../../enum";

export class AndGroup<E> extends BaseGroup<E> {
    type = NodeTypes.GROUP;
    children = [];
    trigger = true;
    name = 'and';
    nodeType: NodeTypes;
    constructor(type: NodeTypes) {
        super();
        this.nodeType = type;
    }
}
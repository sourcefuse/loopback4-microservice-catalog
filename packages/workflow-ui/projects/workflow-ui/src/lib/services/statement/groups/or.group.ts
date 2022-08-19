import { BaseGroup } from "../../../classes/nodes/abstract-base-group.class";
import { NodeTypes } from "../../../enum";

export class OrGroup<E> extends BaseGroup<E> {
    type = NodeTypes.GROUP;
    children = [];
    trigger = false;
    name = 'or';
    nodeType: NodeTypes;
    constructor(type: NodeTypes) {
        super();
        this.nodeType = type;
    }
}
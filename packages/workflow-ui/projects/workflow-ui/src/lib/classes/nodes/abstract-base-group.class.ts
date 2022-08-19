import { NodeTypes } from "../../enum";
import { NodeWithInput } from "../../types";

export abstract class BaseGroup<E> {
    abstract nodeType: NodeTypes;
    abstract trigger: boolean;
    abstract name: string;
    abstract children: (NodeWithInput<E> | BaseGroup<E>)[];
}
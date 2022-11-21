import { NodeTypes } from "../../enum";
import { NodeWithInput } from "../../types";

export abstract class BaseGroup<E> {
  abstract type: NodeTypes;
  abstract nodeType: NodeTypes;
  abstract trigger: boolean;
  abstract name: string;
  abstract children: NodeWithInput<E>[];
  abstract isElseGroup: boolean;
  id: string;
}

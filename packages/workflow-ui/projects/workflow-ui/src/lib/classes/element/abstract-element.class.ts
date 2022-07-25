import {ElementInput} from '../../interfaces/element-input.interface';
import {CreateStrategy} from '../../interfaces/create-strategy.interface';
import {LinkStrategy} from '../../interfaces/link-strategy.interface';
import {RecordOfAnyType} from '../../types/base.types';
import {StatementNode} from '../statement/statement-node.class';

export abstract class WorkflowElement<ElementType> {
  id?: string;
  abstract tag: string;
  abstract attributes: RecordOfAnyType;
  abstract name: string;
  abstract inputs: ElementInput;
  abstract outputs: string;
  protected abstract creator: CreateStrategy<ElementType>;
  protected abstract linker: LinkStrategy<ElementType>;

  /**
   * It creates a new element for the current node, with the given attributes
   * @param node - The node to create the element for.
   * @param {RecordOfAnyType} [attrs] - RecordOfAnyType
   * @returns The return value of the creator.execute method.
   */
  create(node: StatementNode<ElementType>, attrs?: RecordOfAnyType) {
    return this.creator.execute(this, node, {
      ...this.attributes,
      ...(attrs ?? {}),
    });
  }

  /**
   * "The link function is a function that takes a node and returns a link node."
   *
   * @param node - The node to link.
   * @returns The result of the linker's execute method.
   */
  link(node: StatementNode<ElementType>) {
    return this.linker.execute(this, node);
  }
}

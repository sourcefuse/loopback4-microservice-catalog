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

  create(node: StatementNode<ElementType>, attrs?: RecordOfAnyType) {
    return this.creator.execute(this, node, {
      ...this.attributes,
      ...(attrs ?? {}),
    });
  }

  link(node: StatementNode<ElementType>) {
    return this.linker.execute(this, node);
  }
}

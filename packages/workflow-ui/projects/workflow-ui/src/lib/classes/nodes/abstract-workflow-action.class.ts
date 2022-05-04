import {NodeTypes} from '../../enum';
import {WorkflowNode} from './abstract-workflow-node.class';

export abstract class WorkflowAction<E> extends WorkflowNode<E> {
  type = NodeTypes.ACTION;
}

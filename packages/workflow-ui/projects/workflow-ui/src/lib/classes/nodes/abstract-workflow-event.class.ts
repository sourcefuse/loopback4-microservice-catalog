import {NodeTypes, StartElementTypes} from '../../enum';
import {WorkflowNode} from './abstract-workflow-node.class';

export abstract class WorkflowEvent<E> extends WorkflowNode<E> {
  abstract trigger: boolean;
  type = NodeTypes.EVENT;
  startElement = StartElementTypes.BasicStartElement;
}

import {Inject, Injectable} from '@angular/core';
import {WorkflowElement} from '../../../../classes';
import {LinkStrategy} from '../../../../interfaces';
import {
  CustomBpmnModdle,
  ModdleElement,
  BpmnStatementNode,
  ConditionOperatorPair,
  RecordOfAnyType,
} from '../../../../types';
import {CONDITION_LIST} from '../../../../const';
import {UtilsService} from '../../../utils.service';
import {InputTypes} from '../../../../enum';

@Injectable()
export class GatewayLinkStrategy implements LinkStrategy<ModdleElement> {
  constructor(
    private readonly moddle: CustomBpmnModdle,
    private readonly utils: UtilsService,
    @Inject(CONDITION_LIST)
    private readonly conditions: Array<ConditionOperatorPair>,
  ) {}
  /**
   * It creates a link between the current node and the next node, and then creates a link between the
   * current node and the end node
   * @param element - The element that is being converted.
   * @param {BpmnStatementNode} node - BpmnStatementNode
   * @returns An array of ModdleElements.
   */
  execute(
    element: WorkflowElement<ModdleElement>,
    node: BpmnStatementNode,
  ): ModdleElement[] {
    const link = this.createMainLink(node);
    const endLink = this.createEndLink(node);
    return [link, ...endLink];
  }

  private createEndLink(node: BpmnStatementNode) {
    const end = this.moddle.create('bpmn:EndEvent', {
      id: `EndElement_${this.utils.uuid()}`,
    });
    const id = `Flow_${this.utils.uuid()}`;
    const attrs = this.createLinkAttrs(id, node.tag, end);
    const link = this.moddle.create('bpmn:SequenceFlow', attrs);
    node.tag.get('outgoing').push(link);
    end.get('incoming').push(link);
    return [link, end];
  }

  private createMainLink(node: BpmnStatementNode) {
    const from = node.tag;
    const to = node.next.tag;
    const id = node.outgoing ?? `Flow_${this.utils.uuid()}`;
    node.next.incoming = id;
    const attrs = this.createLinkAttrs(id, from, to);
    const {script, name} = this.createScript(node, id);
    const expression = this.moddle.create('bpmn:FormalExpression', {
      body: script,
      language: 'Javascript',
      'xsi:type': 'bpmn:tFormalExpression',
    });
    attrs['conditionExpression'] = expression;
    attrs['name'] = name;
    const link = this.moddle.create('bpmn:SequenceFlow', attrs);
    from.get('outgoing').push(link);
    to.get('incoming').push(link);
    return link;
  }

  private createLinkAttrs(id: string, from: ModdleElement, to: ModdleElement) {
    const start = this.moddle.create('bpmn:FlowNode', {
      id: from.id,
    });
    const end = this.moddle.create('bpmn:FlowNode', {
      id: to.id,
    });
    const attrs: RecordOfAnyType = {
      id: id,
      sourceRef: start,
      targetRef: end,
    };
    return attrs;
  }

  private createScript(node: BpmnStatementNode, flowId: string) {
    const lastNodeWithOutput = this.getLastNodeWithOutput(node);
    const read = `var readObj = JSON.parse(execution.getVariable('${lastNodeWithOutput.element.id}'));`;
    const declarations = `var ids = [];var json = S("{}");`;
    const column = node.workflowNode.state.get('columnName');
    const condition = this.getCondition(node);
    const loop = `
      for(var key in readObj){
          var taskValuePair = readObj[key];
          if(taskValuePair && taskValuePair.value${condition}){
              ids.push(taskValuePair.id);
            }
        }
      `;
    const setters = `
      json.prop("taskIds", ids);
      execution.setVariable('${flowId}',json);
      if(ids.length > 0){true;}else {false;}
      `;
    return {
      script: [read, declarations, loop, setters].join('\n'),
      name: `${column}${condition}`,
    };
  }

  private getLastNodeWithOutput(node: BpmnStatementNode) {
    let current = node;
    while (current) {
      if (current.element.outputs) {
        return current;
      }
      current = current.prev;
    }
    return current;
  }

  private getCondition(node: BpmnStatementNode) {
    let value = node.workflowNode.state.get('value');
    const valueType = node.workflowNode.state.get('valueInputType');
    if (valueType === InputTypes.Text || valueType === InputTypes.List) {
      value = `'${value}'`;
    }
    const condition = node.workflowNode.state.get('condition');
    const pair = this.conditions.find(item => item.condition === condition);
    if (!pair) {
      return `===${value}`;
    }
    if (pair.value) {
      return `${pair.operator}${value}`;
    } else {
      return `${pair.operator}`;
    }
  }
}

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
import {ConditionTypes, InputTypes, NUMBER} from '../../../../enum';
import {WorkflowAction} from '../../../../classes/nodes/abstract-workflow-action.class';
import {GatewayElement} from '../../elements';

const BPMN_SEQ_FLOW = 'bpmn:SequenceFlow';
@Injectable()
export class GatewayLinkStrategy implements LinkStrategy<ModdleElement> {
  constructor(
    private readonly moddle: CustomBpmnModdle,
    private readonly utils: UtilsService,
    @Inject(CONDITION_LIST)
    private readonly conditions: Array<ConditionOperatorPair>,
  ) {}
  execute(
    element: WorkflowElement<ModdleElement>,
    node: BpmnStatementNode,
  ): ModdleElement[] {
    const links = this.createLink(node);
    return links;
  }

  private createLink(node: BpmnStatementNode) {
    const links: ModdleElement[] = [];
    let mainNodes: BpmnStatementNode[] = [];
    let elseNodes: BpmnStatementNode[] = [];
    node.next.forEach(node =>
      (node.element.constructor.name === 'ChangeColumnValue' ||
        node.element.constructor.name === 'SendEmail') &&
      (node.workflowNode as WorkflowAction<ModdleElement>).isElseAction
        ? elseNodes.push(node)
        : mainNodes.push(node),
    );
    links.push(...this.createMainLink(node, mainNodes));
    elseNodes.length && node.element.id?.split('_')[NUMBER.THREE] !== 'OrGroup'
      ? links.push(this.createElseLink(node, elseNodes)!)
      : links.push(...this.createEndLink(node));
    return links;
  }

  private createMainLink(
    node: BpmnStatementNode,
    nextNodes: BpmnStatementNode[],
  ) {
    const link = [];
    const from = node.tag;
    for (let i = 0; i < nextNodes.length; i++) {
      const id = i == 0 ? node.outgoing : `Flow_${this.utils.uuid()}`;
      const to = nextNodes[i].tag;
      nextNodes[i].incoming = id;
      const attrs = this.createLinkAttrs(id, from, to);
      const {script, name} = this.createScript(node, id);
      const expression = this.moddle.create('bpmn:FormalExpression', {
        body: script,
        language: 'Javascript',
        'xsi:type': 'bpmn:tFormalExpression',
      });
      attrs['conditionExpression'] = expression;
      attrs['name'] = name;
      const _link = this.moddle.create(BPMN_SEQ_FLOW, attrs);
      const outgoing = from.get('outgoing');
      const incoming = to.get('incoming');
      if (!outgoing.find((item: ModdleElement) => item.id === id)) {
        outgoing.push(_link);
      }
      if (!incoming.find((item: ModdleElement) => item.id === id)) {
        incoming.push(_link);
      }
      link.push(_link);
    }
    return link;
  }

  private createElseLink(
    node: BpmnStatementNode,
    elseNextNodes: BpmnStatementNode[],
  ) {
    const from = node.tag;
    const id =
      (node.element as GatewayElement).elseOutGoing ??
      `Flow_${this.utils.uuid()}`;
    const to = elseNextNodes[0].tag;
    elseNextNodes[0].incoming = id;
    const attrs = this.createLinkAttrs(id, node.tag, to);
    const {script, name} = this.createScript(node, id, true);
    const expression = this.moddle.create('bpmn:FormalExpression', {
      body: script,
      language: 'Javascript',
      'xsi:type': 'bpmn:tFormalExpression',
    });
    attrs['conditionExpression'] = expression;
    attrs['name'] = name;
    const link = this.moddle.create(BPMN_SEQ_FLOW, attrs);
    const outgoing = from.get('outgoing');
    const incoming = to.get('incoming');
    if (!outgoing.find((item: ModdleElement) => item.id === id)) {
      outgoing.push(link);
    }
    if (!incoming.find((item: ModdleElement) => item.id === id)) {
      incoming.push(link);
    }
    return link;
  }

  private createEndLink(node: BpmnStatementNode) {
    const end = this.moddle.create('bpmn:EndEvent', {
      id: `EndElement_${this.utils.uuid()}`,
    });
    const id =
      (node.element as GatewayElement).default ?? `Flow_${this.utils.uuid()}`;
    const attrs = this.createLinkAttrs(id, node.tag, end);
    const link = this.moddle.create(BPMN_SEQ_FLOW, attrs);
    node.tag.get('outgoing').push(link);
    end.get('incoming').push(link);
    return [link, end];
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

  private createScript(
    node: BpmnStatementNode,
    flowId: string,
    isElse?: boolean,
  ) {
    const lastNodeWithOutput = this.getLastNodeWithOutput(node);
    const read = `var readObj = JSON.parse(execution.getVariable('${lastNodeWithOutput.element.id}'));`;
    const declarations = `var ids = [];var json = S("{}");`;
    const column = node.workflowNode.state.get('columnName');
    const condition = this.getCondition(node);
    const loop = this.createLoopScript(node, condition, isElse);
    const setters = `
      json.prop("taskIds", ids);
      execution.setVariable('${flowId}',json);
      if(ids.length > 0){true;}else {false;}
      `;
    return {
      script: [read, declarations, loop, setters].join('\n'),
      name: isElse ? `!(${column}${condition})` : `${column}${condition}`,
    };
  }

  private createLoopScript(
    node: BpmnStatementNode,
    condition: string,
    isElse = false,
  ) {
    const column: string = node.workflowNode.state.get('columnName');
    const conditionType = node.workflowNode.state.get('condition');
    const conditionExpression =
      ConditionTypes.NotEqual === conditionType ? '!' : '';
    const conditionExpressionElse =
      ConditionTypes.NotEqual === conditionType ? '' : '!';
    if (column?.toLowerCase() === InputTypes.People) {
      return !isElse
        ? `var selectedVals = ${condition};
      var selCol = selectedVals.split(',');
      for(var key in readObj){
        var taskValuePair = readObj[key];
        if(taskValuePair && taskValuePair.value && taskValuePair.value.length){
            var hasUser = false;
            var usCol = taskValuePair.value;

            for(var selKey in selCol){
                for(var myKey in usCol){
                    if(usCol[myKey].value == selCol[selKey] && !hasUser){
                        hasUser = true;
                    }
                }
            }
            if(${conditionExpression}(hasUser)){
                ids.push(taskValuePair.id);
            }
        }
      }`
        : `var selectedVals = ${condition};
          var selCol = selectedVals.split(',');
          for(var key in readObj){
            var taskValuePair = readObj[key];
            if(taskValuePair && taskValuePair.value && taskValuePair.value.length){
                var hasUser = false;
                var usCol = taskValuePair.value;

                for(var selKey in selCol){
                    for(var myKey in usCol){
                        if(usCol[myKey].value == selCol[selKey] && !hasUser){
                            hasUser = true;
                        }
                    }
                }
                if(${conditionExpressionElse}(hasUser)){
                    ids.push(taskValuePair.id);
                }
            }
          }`;
    }
    switch (conditionType) {
      case ConditionTypes.PastToday:
        return `
                for(var key in readObj){
                  var taskValuePair = readObj[key];
                  if(taskValuePair && taskValuePair.value){
                    var readDateValue = new Date(taskValuePair.value);
                    if(${isElse ? '!' : ''}(readDateValue < new Date())){
                      ids.push(taskValuePair.id);
                    }
                  }
                }
              `;
      case ConditionTypes.ComingIn:
      case ConditionTypes.PastBy:
        return `
                for(var key in readObj){
                  var taskValuePair = readObj[key];
                  if(taskValuePair && taskValuePair.value){
                    var readDateValue = new Date(taskValuePair.value);
                    if(${
                      isElse ? '!' : ''
                    }(readDateValue > new Date() && readDateValue.setDate(readDateValue.getDate()${condition}) < new Date())){
                      ids.push(taskValuePair.id);
                    }
                  }
                }
              `;
      default:
        return `
                for(var key in readObj){
                  var taskValuePair = readObj[key];
                  if(taskValuePair && ${
                    isElse ? '!' : ''
                  }(taskValuePair.value${condition})){
                    ids.push(taskValuePair.id);
                  }
                }
              `;
    }
  }

  private getLastNodeWithOutput(node: BpmnStatementNode) {
    let queue = [node];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.element.outputs) {
        return current;
      }
      if (current?.prev && current.prev.length) queue.push(...current.prev);
    }
    return queue[queue.length - 1];
  }

  private getCondition(node: BpmnStatementNode) {
    let value = node.workflowNode.state.get('value');
    const valueType = node.workflowNode.state.get('valueInputType');
    if (valueType === InputTypes.Text || valueType === InputTypes.List) {
      value = `'${value}'`;
    }
    if (value && valueType === InputTypes.People) {
      return `'${value.ids}'`;
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

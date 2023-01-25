import {Inject, Injectable} from '@angular/core';
import {WorkflowElement} from '../../../../classes';
import {LinkStrategy} from '../../../../interfaces';
import {
  CustomBpmnModdle,
  ModdleElement,
  BpmnStatementNode,
  ConditionOperatorPair,
  RecordOfAnyType,
  BpmnAction,
} from '../../../../types';
import {CONDITION_LIST} from '../../../../const';
import {UtilsService} from '../../../utils.service';
import {ConditionTypes, InputTypes, NUMBER} from '../../../../enum';
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

  /**
   * It creates a link between two nodes
   * @param element - The element that is being processed.
   * @param {BpmnStatementNode} node - BpmnStatementNode
   * @returns An array of ModdleElements
   */
  execute(
    element: WorkflowElement<ModdleElement>,
    node: BpmnStatementNode,
  ): ModdleElement[] {
    const links = this.createLink(node);
    return links;
  }

  /**
   * It creates a link between two nodes
   * @param {BpmnStatementNode} node - BpmnStatementNode
   * @returns An array of links.
   */
  private createLink(node: BpmnStatementNode) {
    const links: ModdleElement[] = [];
    let mainNodes: BpmnStatementNode[] = [];
    let elseNodes: BpmnStatementNode[] = [];
    node.next.forEach(node =>
      (node.element.constructor.name === 'ChangeColumnValue' ||
        node.element.constructor.name === 'SendEmail') &&
      (node.workflowNode as BpmnAction).isElseAction
        ? elseNodes.push(node)
        : mainNodes.push(node),
    );
    links.push(...this.createMainLink(node, mainNodes));
    elseNodes.length && node.element.id?.split('_')[NUMBER.THREE] !== 'OrGroup'
      ? links.push(this.createElseLink(node, elseNodes)!)
      : links.push(...this.createEndLink(node));
    return links;
  }

  /**
   * It creates a link between two nodes
   * @param {BpmnStatementNode} node - The current node
   * @param {BpmnStatementNode[]} nextNodes - The next node of the current node
   * @returns An array of links.
   */
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

  /**
   * It creates a link between the current node and the next node
   * @param {BpmnStatementNode} node - The current node
   * @param {BpmnStatementNode[]} elseNextNodes - The next node of the else branch
   * @returns A link between the current node and the next node.
   */
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

  /**
   * It creates a link between the current node and the end node
   * @param {BpmnStatementNode} node - BpmnStatementNode
   * @returns An array of two elements.
   */
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

  /**
   * It creates a link between two nodes
   * @param {string} id - The id of the link
   * @param {ModdleElement} from - ModdleElement - the source element
   * @param {ModdleElement} to - ModdleElement - the element that the link is going to
   * @returns An object with the id, sourceRef, and targetRef properties.
   */
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

  /**
   * It creates a script that loops through the rows of the table and adds the taskIds of the rows that
   * match the condition to an array
   * @param {BpmnStatementNode} node - The node that we're creating the script for.
   * @param {string} flowId - The id of the flow that is being created.
   * @param {boolean} [isElse] - boolean - This is a flag that tells the script whether it's an if or
   * an else statement.
   * @returns An object with a script and a name.
   */
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

  /**
   * It creates a loop script that loops through the data and pushes the ids of the tasks that match
   * the condition to an array
   * @param {BpmnStatementNode} node - BpmnStatementNode - this is the node that is being processed
   * @param {string} condition - The condition that is being checked.
   * @param [isElse=false] - This is a boolean value that determines whether the script is for the if
   * or else statement.
   * @returns A string of javascript code.
   */
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

  /**
   * > Get the last node in the graph that has outputs
   * @param {BpmnStatementNode} node - The node to start from
   * @returns The last node with an output.
   */
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

  /**
   * It returns a string that represents the condition of the node
   * @param {BpmnStatementNode} node - BpmnStatementNode - the node that is being processed
   * @returns The condition is being returned.
   */
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

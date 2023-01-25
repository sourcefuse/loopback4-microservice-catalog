import {Injectable} from '@angular/core';
import {RecordOfAnyType} from '../../../../types/base.types';
import {
  BpmnAction,
  BpmnElement,
  BpmnStatementNode,
  CustomBpmnModdle,
  ModdleElement,
} from '../../../../types/bpmn.types';
import {UtilsService} from '../../../utils.service';
import {
  CreateStrategy,
  FromParam,
  isFormattedParam,
  isFromParam,
  isStateParam,
} from '../../../../interfaces';
import {InvalidEntityError} from '../../../../errors';
import {NodeTypes} from '../../../../enum';
import {GatewayElement} from '../../elements/gateways/gateway.element';

@Injectable()
export class CreateTaskStrategy implements CreateStrategy<ModdleElement> {
  constructor(
    private readonly moddle: CustomBpmnModdle,
    private readonly utils: UtilsService,
  ) {}

  /**
   * It creates a BPMN element, sets its ID, and adds inputs and outputs to it
   * @param {BpmnElement} element - BpmnElement,
   * @param {BpmnStatementNode} node - BpmnStatementNode,
   * @param {RecordOfAnyType} attrs - RecordOfAnyType - This is a record of any type. It's used to pass
   * in any custom attributes that you want to add to the element.
   * @returns The moddle.create method is being called with the element.tag, and the customAttrs.
   */
  execute(
    element: BpmnElement,
    node: BpmnStatementNode,
    attrs: RecordOfAnyType,
  ) {
    if (!node.workflowNode) {
      throw new InvalidEntityError(node.constructor.name);
    }

    element.id = `${element.constructor.name}_${node.workflowNode.constructor.name}_${node.workflowNode.id}_${node.workflowNode.groupType}_${node.workflowNode.groupId}`;
    if (node.workflowNode.type === NodeTypes.ACTION) {
      element.id += `_${
        (node.workflowNode as BpmnAction).isElseAction
      }`;
    }
    node.outgoing = `Flow_${this.utils.uuid()}`;
    const customAttrs = Object.assign(
      {},
      {
        id: element.id,
        name: element.name,
      },
      attrs,
    );
    const params = [];
    if (element.inputs) {
      params.push(this.input(element, node));
    }
    if (element.outputs) {
      params.push(this.output(element));
    }

    if (params.length > 0) {
      const extension = this.moddle.create('bpmn:ExtensionElements');
      const inputOutput = this.moddle.create('camunda:InputOutput');
      params.forEach(param => {
        inputOutput.get('inputParameters').push(param);
      });
      extension.get('values').push(inputOutput);
      customAttrs['extensionElements'] = extension;
    }

    return this.moddle.create(element.tag, customAttrs);
  }

  /**
   * It creates a script that contains a JSON string that represents the node's data
   * @param {BpmnElement} element - BpmnElement - the element that is being converted
   * @param {BpmnStatementNode} node - The node that is being converted to a BPMN element.
   * @returns The input parameter for the script task.
   */
  private input(element: BpmnElement, node: BpmnStatementNode) {
    const input = element.inputs;

    const script = this.moddle.create('camunda:Script', {
      scriptFormat: 'Javascript',
      value: this.createJsonScript(element, node),
    });
    return this.moddle.create('camunda:InputParameter', {
      name: input.name,
      definition: script,
    });
  }

  /**
   * It creates a new InputParameter element with the name outputVariable and the value of the
   * element's id
   * @param {BpmnElement} element - BpmnElement - the element that we want to create a parameter for
   * @returns A new InputParameter object with the name 'outputVariable' and the value of the element's
   * id.
   */
  private output(element: BpmnElement) {
    return this.moddle.create('camunda:InputParameter', {
      name: 'outputVariable',
      value: element.id,
    });
  }

  /**
   * It takes an array of strings and returns a string of comma separated values
   * @param {string[]} ids - string[] - this is the array of ids that you want to transpose into a
   * string
   * @returns A string of ids separated by commas.
   */
  private transposeArrayToString(ids: string[]) {
    let idCol = '';
    ids?.forEach(id => {
      idCol = idCol.concat(`'${id}',`);
    });

    return idCol.substring(0, idCol.length - 1);
  }

  /**
   * It takes the inputs of the element, the node, and the state of the workflow, and returns a string
   * of JavaScript that will create a JSON object
   * @param {BpmnElement} element - BpmnElement - the element that is being processed
   * @param {BpmnStatementNode} node - BpmnStatementNode
   * @returns A string of javascript code that is used to create a JSON object.
   */
  private createJsonScript(element: BpmnElement, node: BpmnStatementNode) {
    const params = element.inputs.fields;
    const prevIds = this.getInputFromPrev(element, node);
    const state = node.workflowNode.state;
    const froms = Object.values(params).filter(p => isFromParam(p));
    let read = '';
    if (froms.length > 0) {
      if (prevIds.length) {
        read = `var readObj = ${prevIds
          .map(id => `JSON.parse(execution.getVariable('${id}'))`)
          .join(' || ')} || {};`;
      }
    }
    const getVariables = froms
      .map(
        p =>
          `var ${(p as FromParam).from}Local = readObj.${
            (p as FromParam).from
          };`,
      )
      .join('\n');
    const setVariabels = Object.keys(params).reduce(
      (p: string, key: string) => {
        const tmp = params[key];
        if (isFormattedParam(tmp)) {
          return `${p}\njson.prop("${key}", ${tmp.formatter(state)});`;
        } else if (isFromParam(tmp)) {
          return `${p}\njson.prop("${key}", ${tmp.from}Local);`;
        } else if (isStateParam(tmp)) {
          if (
            tmp.state === 'recipients' &&
            Array.isArray(state.get(tmp.state))
          ) {
            const metaValue = this.transposeArrayToString(state.get(tmp.state));
            return `${p}\njson.prop("${key}", [${metaValue ?? ''}]);`;
          }

          return `${p}\njson.prop("${key}", "${state.get(tmp.state) ?? ''}");`;
        } else {
          return `${p}\njson.prop("${key}", "${tmp.value}");`;
        }
      },
      '',
    );
    return [
      read,
      getVariables,
      `var json = S("{}");`,
      setVariabels,
      'json',
    ].join('\n');
  }

  /**
   * It returns the id of the previous node if the previous node is not a gateway, otherwise it returns
   * the id of the previous node's outgoing or elseOutgoing property depending on whether the current
   * node is a true or false branch of the gateway
   * @param element - The current element that is being processed.
   * @param {BpmnStatementNode} node - BpmnStatementNode - The node that is being processed
   * @returns The id of the previous element.
   */
  getInputFromPrev(
    element: BpmnElement,
    node: BpmnStatementNode,
  ) {
    const prevGateways = node.prev.filter(
      n => n.element.constructor.name === 'GatewayElement',
    );
    if (prevGateways.length) {
      return node.element.id?.split('_').includes('true')
        ? prevGateways.map(e => (e.element as GatewayElement).elseOutGoing)
        : prevGateways.map(e => e.outgoing);
    } else {
      return [node.prev[0].element.id];
    }
  }
}

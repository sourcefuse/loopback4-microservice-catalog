import {Injectable} from '@angular/core';
import {RecordOfAnyType} from '../../../../types/base.types';
import {
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
import {WorkflowAction, WorkflowElement} from '../../../../classes';
import {InvalidEntityError} from '../../../../errors';
import {InputTypes, NodeTypes} from '../../../../enum';
import {GatewayElement} from '../../elements/gateways/gateway.element';

@Injectable()
export class CreateTaskStrategy implements CreateStrategy<ModdleElement> {
  constructor(
    private readonly moddle: CustomBpmnModdle,
    private readonly utils: UtilsService,
  ) {}
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
        (node.workflowNode as WorkflowAction<ModdleElement>).isElseAction
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

  private output(element: BpmnElement) {
    return this.moddle.create('camunda:InputParameter', {
      name: 'outputVariable',
      value: element.id,
    });
  }

  private transposeArrayToString(ids: string[]) {
    let idCol = '';
    ids?.forEach(id => {
      idCol = idCol.concat(`'${id}',`);
    });

    return idCol.substring(0, idCol.length - 1);
  }

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

  getInputFromPrev(
    element: WorkflowElement<ModdleElement>,
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

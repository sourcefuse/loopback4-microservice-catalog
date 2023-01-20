import {InjectionToken} from '@angular/core';
import {WorkflowElement} from './classes/element/abstract-element.class';
import {ConditionTypes} from './enum';
import {ConditionOperatorPair} from './types/base.types';
import {BpmnNode, CustomBpmnModdle, ModdleElement} from './types/bpmn.types';

export const BASE_XML_VALUE = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
xmlns:modeler="http://camunda.org/schema/modeler/1.0"
id="Definitions_1aj5pzu"
targetNamespace="http://bpmn.io/schema/bpmn"
exporter="Camunda Modeler" exporterVersion="4.12.0"
modeler:executionPlatform="Camunda Platform"
modeler:executionPlatformVersion="7.15.0">
</bpmn:definitions>
`;

export const JSON_SCRIPT_START = `var json = S(\"{}\");\n`;
export const JSON_SCRIPT_END = `\n        json`;

export const BASE_XML = new InjectionToken<string>('diagram.bpmn.base');
export const MODDLE = new InjectionToken<CustomBpmnModdle>(
  'bpmn.moddle.constructor',
);

export const BPMN_ELEMENTS = new InjectionToken<WorkflowElement<ModdleElement>>(
  'bpmn.moddle.element',
);
export const BPMN_NODES = new InjectionToken<BpmnNode>('bpmn.moddle.node');
export const BPMN_INPUTS = new InjectionToken<BpmnNode>('bpmn.moddle.input');

export const DEFAULT_NODE = 'BASE_NODE';

export const CONDITION_LIST = new InjectionToken<Array<ConditionOperatorPair>>(
  'workflow.const.types.list',
);

/* A list of condition types and their operators. */
export const typeTuppleList: Array<ConditionOperatorPair> = [
  {condition: ConditionTypes.Equal, operator: '===', value: true},
  {condition: ConditionTypes.NotEqual, operator: '!==', value: true},
  {condition: ConditionTypes.GreaterThan, operator: '>', value: true},
  {condition: ConditionTypes.LessThan, operator: '<', value: true},
  {condition: ConditionTypes.ComingIn, operator: '-', value: true},
  {condition: ConditionTypes.PastBy, operator: '+', value: true},
];

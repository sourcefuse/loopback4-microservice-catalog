import {InputChanged} from './event.types';
import {WorkflowElement} from '../classes/element/abstract-element.class';
import {WorkflowPrompt} from '../classes/nodes/abstract-prompt.class';
import {WorkflowAction} from '../classes/nodes/abstract-workflow-action.class';
import {WorkflowEvent} from '../classes/nodes/abstract-workflow-event.class';
import {StatementNode} from '../classes/statement/statement-node.class';
import {State} from '../classes/state';
import {RecordOfAnyType} from './base.types';

export interface Properties {
  model: CustomBpmnModdle;
}
export interface Factory {
  model: CustomBpmnModdle;
  properties: Properties;
}
export interface Registry {
  packageMap: Record<string, RecordOfAnyType>;
  packages: Array<RecordOfAnyType>;
  properties: Properties;
  typeMap: Record<string, RecordOfAnyType>;
}

export interface ParseResult {
  rootElement: ModdleElement;
  references: Array<Object>;
  warnings: Array<Error>;
  elementsById: Object;
}

export interface ParseError {
  warnings: Array<Error>;
}

export interface SerializationResult {
  xml: string;
}
export interface ModdleElement {
  $type: string;
  id: string;
  targetNamespace: string;
  $attrs: RecordOfAnyType;
  $parent: ModdleElement | undefined;
  $descriptor: RecordOfAnyType;
  $model: CustomBpmnModdle;
  get(key: string): Array<ModdleElement>;
  get(key: 'targetRef'): ModdleElement;
  get(key: 'sourceRef'): ModdleElement;
  get(key: 'plane'): ModdleElement;
  get(key: 'bpmnElement'): string[];
  get(key: 'inputParameters'): ModdleElement[];
  get(key: 'extensionElements'): ModdleElement;
  // sonarignore:start
  [key: string]: any;
  // sonarignore:end
}

export abstract class CustomBpmnModdle {
  abstract factory: Factory;
  abstract properties: Properties;
  abstract registry: Registry;
  abstract typeCache: RecordOfAnyType;
  abstract fromXML: (
    xmlStr: string,
    typeName?: string,
    options?: RecordOfAnyType,
  ) => Promise<ParseResult>;
  abstract toXML: (
    rootElement: ModdleElement,
    options?: RecordOfAnyType,
  ) => Promise<SerializationResult>;
  abstract create: (
    descriptor: string | RecordOfAnyType,
    attrs?: RecordOfAnyType,
    options?: RecordOfAnyType,
  ) => ModdleElement;
  abstract createAny: (
    name: string,
    nsUri?: RecordOfAnyType,
    properties?: RecordOfAnyType,
  ) => ModdleElement;
  abstract getElementDescriptor: (element: RecordOfAnyType) => string;
  abstract getPackage: (uriOrPrefix: string) => RecordOfAnyType;
  abstract getPackages: () => Array<RecordOfAnyType>;
  abstract getPropertyDescriptor: (
    element: string | ModdleElement,
    property: string,
  ) => string;
  abstract getType: (descriptor: string) => string;
  abstract getTypeDescriptor: (type: string) => string;
  abstract hasType: (element: string, type: string) => string;
}

export interface BpmnDiagram {
  type: string;
  height: number;
  width: number;
}

export type ValueCouple = {
  key: string;
  value: string;
};

export abstract class BpmnElement extends WorkflowElement<ModdleElement> {}
export abstract class BpmnAction extends WorkflowAction<ModdleElement> {
  state: State<RecordOfAnyType>;
  constructor() {
    super();
    this.state = new State();
  }
}
export abstract class BpmnEvent extends WorkflowEvent<ModdleElement> {
  state: State<RecordOfAnyType>;
  constructor() {
    super();
    this.state = new State();
  }
}

export type BpmnNode = BpmnAction | BpmnEvent;

export type BpmnState = State<RecordOfAnyType>;

export type BpmnNodePrompt = WorkflowPrompt;

export type BpmnInputChanged = InputChanged<ModdleElement>;

export type BpmnStatementNode = StatementNode<ModdleElement>;

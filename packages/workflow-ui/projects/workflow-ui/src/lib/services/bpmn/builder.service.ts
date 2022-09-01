import { Inject, Injectable } from '@angular/core';
import {
  WorkflowElement,
  BuilderService,
  ElementService,
  NodeService,
  Statement,
  StatementNode,
  WorkflowAction,
  WorkflowEvent,
} from '../../classes';
import { BASE_XML } from '../../const';
import { NodeTypes } from '../../enum';
import { AutoLayoutService } from '../../layout/layout.service';
import {
  BpmnElement,
  CustomBpmnModdle,
  ModdleElement,
  RecordOfAnyType,
  StateMap,
  WorkflowNode,
} from '../../types';
import { ProcessPropertiesElement } from './elements/process/process-properties.element';
@Injectable()
export class BpmnBuilderService extends BuilderService<
  ModdleElement,
  RecordOfAnyType
> {
  private root?: ModdleElement;
  constructor(
    private readonly moddle: CustomBpmnModdle,
    @Inject(BASE_XML)
    private readonly baseXML: string,
    private readonly elements: ElementService<ModdleElement>,
    private readonly nodes: NodeService<ModdleElement>,
    private readonly layout: AutoLayoutService,
  ) {
    super();
  }

  async build(statement: Statement<ModdleElement>) {
    const result = await this.moddle.fromXML(this.baseXML);
    this.root = result.rootElement;
    const attrs: RecordOfAnyType = {};
    if (statement.processId) {
      attrs['id'] = statement.processId;
    }
    if (statement.state) {
      attrs['extensionElements'] = this.saveProperties(
        statement.state,
        statement.head[0],
      );
    }
    const start = this.elements.createInstanceByName('StartElement');
    const end = this.elements.createInstanceByName('EndElement');
    const base = this.elements.createElementByName(
      'ProcessElement',
      statement.head[0],
      attrs,
    );
    this.root.get('rootElements').push(base);
    statement.addStart(start);
    statement.addEnd(end);
    let current = statement.head;
    while (current) {
      if (current.length === 1) {
        const tag = current[0].element.create(current[0]);
        base.get('flowElements').push(tag);
        current[0].setTag(tag);
        if (current[0].prev) {
          const prev = current[0].prev;
          if (prev.length === 1) {
            const link = prev[0].element.link(prev[0]);
            base.get('flowElements').push(...link);
          }
          else {
            //TODO
          }
        }
        current = current[0].next;
      }
      else {
        //TODO
      }
    }
    const { xml } = await this.moddle.toXML(this.root);
    try {
      return (await this.layout.layoutProcess(xml)).xml;
    } catch (e) {
      return '';
    }
  }

  async restore(xml: string) {
    const result = await this.moddle.fromXML(xml);
    this.root = result.rootElement;
    const process = this.root.get('rootElements')[0];
    const state = this.getProperties(process);
    const tags = process
      .get('flowElements')
      .filter(
        el =>
          !(
            el.id.includes('Start') ||
            el.id.includes('End') ||
            el.id.includes('Flow')
          ),
      );
    const actions: WorkflowAction<ModdleElement>[] = [];
    const events: WorkflowEvent<ModdleElement>[] = [];
    let elements: WorkflowElement<ModdleElement>[] = [];
    let currentNode: WorkflowNode<ModdleElement>;
    tags.forEach(tag => {
      const [elementCtor, nodeCtor, id] = tag.id.split('_');
      const element = this.elements.createInstanceByName(elementCtor);
      currentNode = this.nodes.getNodeByName(nodeCtor, id);
      currentNode.id = id;
      elements.push(element);
      if (currentNode && this.compareNode(currentNode, elements)) {
        elements = [];
        if (currentNode.type === NodeTypes.ACTION) {
          actions.push(currentNode);
        } else {
          events.push(currentNode as WorkflowEvent<ModdleElement>);
        }
      }
    });
    return {
      actions,
      events,
      state,
      process,
    };
  }

  private saveProperties(
    state: StateMap<RecordOfAnyType>,
    node: StatementNode<ModdleElement>,
  ) {
    return this.elements.createElement(ProcessPropertiesElement, node, {
      state,
    });
  }

  private getProperties(element: ModdleElement) {
    const extension = element.get('extensionElements');
    const state: RecordOfAnyType = {};
    if (extension) {
      const properties = extension.get('values')[0];
      if (properties && properties['values']) {
        properties.get('values').forEach(property => {
          const [id, key] = property['name'].split('_');
          if (state[id]) {
            state[id][key] = property['value'];
          } else {
            state[id] = {
              [key]: property['value'],
            };
          }
        });
      }
    }
    return state;
  }

  private compareNode(
    node: WorkflowNode<ModdleElement>,
    elements: BpmnElement[],
  ) {
    if (elements.length !== node.elements.length) {
      return false;
    }
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].constructor !== node.elements[i]) {
        return false;
      }
    }
    return true;
  }
}

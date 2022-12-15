import {Inject, Injectable} from '@angular/core';
import {
  WorkflowElement,
  BuilderService,
  ElementService,
  NodeService,
  Statement,
  StatementNode,
  WorkflowAction,
} from '../../classes';
import {BaseGroup} from '../../classes/nodes/abstract-base-group.class';
import {BASE_XML, JSON_COLUMNS} from '../../const';
import {NodeTypes} from '../../enum';
import {AutoLayoutService} from '../../layout/layout.service';
import {
  CustomBpmnModdle,
  ModdleElement,
  RecordOfAnyType,
  StateMap,
  WorkflowNode,
} from '../../types';
import {ProcessPropertiesElement} from './elements/process/process-properties.element';
import {ActionWithInput, EventWithInput} from '../../types/base.types';
import {UtilsService} from '../utils.service';

@Injectable()
export class BpmnBuilderService extends BuilderService<
  ModdleElement,
  RecordOfAnyType
> {
  private root?: ModdleElement;
  private base: ModdleElement;
  constructor(
    private readonly moddle: CustomBpmnModdle,
    @Inject(BASE_XML)
    private readonly baseXML: string,
    private readonly elements: ElementService<ModdleElement>,
    private readonly nodes: NodeService<ModdleElement>,
    private readonly layout: AutoLayoutService,
    private readonly utils: UtilsService,
  ) {
    super();
  }

  async build(
    statement: Statement<ModdleElement>,
    elseStatement: Statement<ModdleElement>,
  ) {
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
    this.base = this.elements.createElementByName(
      'ProcessElement',
      statement.head[0],
      attrs,
    );
    this.root.get('rootElements').push(this.base);
    statement.addStart(start);
    statement.addEnd(end);
    let current = statement.head;
    while (current) {
      if (
        elseStatement.head.length &&
        current[0].element.constructor.name === 'GatewayElement'
      ) {
        this.getPreviousNode(elseStatement, current[0]);
      }
      this.setTags(current);
      this.linkNodes(current);
      if (current.length > 1) {
        this.processNodes(current, elseStatement);
      }
      current = current[0].next;
    }
    this.elseStatementBuild(elseStatement);
    const {xml} = await this.moddle.toXML(this.root);
    try {
      return (await this.layout.layoutProcess(xml)).xml;
    } catch (e) {
      return '';
    }
  }

  private processNodes(
    current: StatementNode<ModdleElement>[],
    elseStatement: Statement<ModdleElement>,
  ) {
    for (let i = 1; i < current.length; i++) {
      if (
        elseStatement.head.length &&
        current[i].element.constructor.name === 'GatewayElement'
      ) {
        this.getPreviousNode(elseStatement, current[i]);
      }
      if (current[i].next) {
        this.setTags(current[i].next);
        this.linkNodes(current[i].next);
      }
    }
  }

  private getPreviousNode(
    elseStatement: Statement<ModdleElement>,
    currentNode: StatementNode<ModdleElement>,
  ) {
    const head = elseStatement.head[0];
    let prev = head.prev;
    currentNode.next.push(head);
    if (prev) {
      prev.push(currentNode);
    } else {
      head.prev = [currentNode];
    }
  }

  private elseStatementBuild(eStatement: Statement<ModdleElement>) {
    if (!eStatement.head.length) return;
    const end = this.elements.createInstanceByName('EndElement');
    eStatement.addEnd(end);
    let current = eStatement.head;
    while (current) {
      this.setTags(current);
      this.linkNodes(current);
      current = current[0].next;
    }
  }

  setTags(statementNode: StatementNode<ModdleElement>[]) {
    statementNode.forEach(element => {
      const tag = element.element.create(element);
      this.base.get('flowElements').push(tag);
      element.setTag(tag);
    });
  }

  linkNodes(statementNode: StatementNode<ModdleElement>[]) {
    for (let element of statementNode) {
      if (element.prev && element.tag) {
        for (let _element of element.prev) {
          const link = _element.element.link(_element);
          this.base.get('flowElements').push(...link);
        }
      }
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
    const actions: ActionWithInput<ModdleElement>[] = [];
    const elseActions: ActionWithInput<ModdleElement>[] = [];
    const events: EventWithInput<ModdleElement>[] = [];
    const groups: BaseGroup<ModdleElement>[] = [];
    const groupIds: string[] = [];
    const nodeIds: string[] = [];
    let elements: WorkflowElement<ModdleElement>[] = [];
    let currentNode: WorkflowNode<ModdleElement>;
    tags.forEach(tag => {
      const [elementCtor, nodeCtor, id, groupType, groupId, isElseAction] =
        tag.id.split('_');
      const element = this.elements.createInstanceByName(elementCtor);
      currentNode = this.nodes.getNodeByName(
        nodeCtor,
        groupType,
        groupId,
        id,
        isElseAction == 'true' ? true : false,
      );
      if (!groupIds.includes(groupId) && isElseAction !== 'true') {
        groupIds.push(groupId);
        let currentGroup = this.nodes.getGroupByName(
          groupType,
          currentNode.type,
          groupId,
        );
        currentGroup.id = groupId;
        groups.push(currentGroup);
      }
      currentNode.id = id;
      elements.push(element);
      if (currentNode && !nodeIds.includes(currentNode.id)) {
        nodeIds.push(currentNode.id);
        elements = [];
        if (currentNode.type === NodeTypes.ACTION) {
          const nodeWithInput = {
            node: currentNode as WorkflowAction<ModdleElement>,
            inputs: this.nodes.mapInputs(currentNode.prompts),
          };
          (currentNode as WorkflowAction<ModdleElement>).isElseAction
            ? elseActions.push(nodeWithInput)
            : actions.push(nodeWithInput);
        } else {
          events.push({
            node: currentNode,
            inputs: this.nodes.mapInputs(currentNode.prompts),
          } as EventWithInput<ModdleElement>);
        }
      }
    });
    return {
      actions,
      elseActions,
      events,
      groups,
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
            //TODO: Refactor this part
            state[id][key] =
              (JSON_COLUMNS.includes(state[id].columnName?.toLowerCase()) &&
                property['name'] === `${id}_value`) ||
              key === 'specificRecepient'
                ? JSON.parse(property['value'])
                : property['value'];
          } else {
            state[id] = {
              [key]:
                key === 'email'
                  ? JSON.parse(property['value'])
                  : property['value'],
            };
          }
        });
      }
    }
    return state;
  }
}

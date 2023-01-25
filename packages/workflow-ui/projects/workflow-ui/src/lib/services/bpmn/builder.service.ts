import {Inject, Injectable} from '@angular/core';
import {
  WorkflowElement,
  BuilderService,
  ElementService,
  NodeService,
  Statement,
  StatementNode,
} from '../../classes';
import {BaseGroup} from '../../classes/nodes/abstract-base-group.class';
import {BASE_XML} from '../../const';
import {NodeTypes, StartElementTypes} from '../../enum';
import {AutoLayoutService} from '../../layout/layout.service';
import {
  BpmnAction,
  BpmnEvent,
  BpmnStatementNode,
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

  /**
   * It takes a statement and an else statement, and returns a promise that resolves to a string of XML
   * @param statement - Statement<ModdleElement>
   * @param elseStatement - The else statement that is to be added to the main flow.
   * @returns The XML of the process
   */
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
    const start = this.getStartEvent(statement.head[0]);
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
    // sonarignore:start
    // TODO: Refactor this code to be more flexible
    // sonarignore:start
    this.addElseIntoMainFlow(elseStatement, statement);
    this.traverseToSetTags(current[0]);
    this.traverseToLink(current[0]);
    const {xml} = await this.moddle.toXML(this.root);
    try {
      return (await this.layout.layoutProcess(xml)).xml;
    } catch (e) {
      return '';
    }
  }

  /**
   * > It creates a new instance of a StartElement, StartOnIntervalElement, or StartElement depending
   * on the type of trigger
   * @param trigger - StatementNode<ModdleElement>
   * @returns A start event.
   */
  private getStartEvent(trigger: BpmnStatementNode) {
    if (!trigger) {
      return this.elements.createInstanceByName(StartElementTypes.BasicStartElement);
    }
    return this.elements.createInstanceByName((trigger.workflowNode as BpmnEvent).startElement);
  }

  /**
   * It traverses the tree and sets the tags for each node.
   * @param root - The root node of the tree.
   */
  traverseToSetTags(root: BpmnStatementNode) {
    let queue = [root];
    while (queue.length > 0) {
      let current = queue.shift()!;
      if (!current.tag) this.setTags(current);
      if (current?.next && current.next.length) queue.push(...current.next);
    }
  }

  /**
   * It traverses the tree and links the nodes.
   * @param root - The root node of the tree.
   */
  traverseToLink(root: BpmnStatementNode) {
    let queue = [root];
    while (queue.length > 0) {
      const current = queue.shift()!;
      this.linkNodes(current);
      if (current?.next && current.next.length) queue.push(...current.next);
    }
  }

  /**
   * It adds the else statement to the main flow
   * @param elseStatement - Statement<ModdleElement> - the statement that contains the else flow
   * @param statement - Statement<ModdleElement> - the statement that is being parsed
   * @returns The return statement stops the execution of a function and returns a value from that
   * function.
   */
  private addElseIntoMainFlow(
    elseStatement: Statement<ModdleElement>,
    statement: Statement<ModdleElement>,
  ) {
    if (!elseStatement.head.length) {
      return;
    }
    const elseEnd = this.elements.createInstanceByName('EndElement');
    elseStatement.addEnd(elseEnd);
    let queue = [statement.head[0]];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (
        elseStatement.head.length &&
        (current.element.constructor.name === 'GatewayElement' ||
          current.element.constructor.name === 'OrGatewayElement')
      ) {
        current.next.push(elseStatement.head[0]);
        if (elseStatement.head[0].prev) {
          elseStatement.head[0].prev.push(current);
        } else {
          elseStatement.head[0].prev = [current];
        }
      }
      if (current?.next && current.next.length) queue.push(...current.next);
    }
  }

  /**
   * It creates a new tag for the element and adds it to the base
   * @param element - StatementNode<ModdleElement>
   */
  setTags(element: BpmnStatementNode) {
    if (
      element.element.constructor.name === 'ChangeColumnValue' ||
      element.element.constructor.name === 'SendEmail'
    ) {
      for (let ele of element.prev) {
        ele.element.create(ele);
      }
    }
    const tag = element.element.create(element);
    this.base.get('flowElements').push(tag);
    element.setTag(tag);
  }

  /**
   * It links the nodes in the diagram.
   * @param element - StatementNode<ModdleElement>
   */
  linkNodes(element: BpmnStatementNode) {
    if (element.prev) {
      for (let _element of element.prev) {
        if (_element.next) {
          const link = _element.element.link(_element);
          this.base.get('flowElements').push(...link);
        }
      }
    }
  }

  /**
   * It takes an XML string, converts it to a moddle object, and then returns an object with the
   * actions, events, groups, state, and process
   * @param {string} xml - The XML string that you want to restore.
   * @returns An object with the following properties:
   * - actions: An array of ActionWithInput objects
   * - elseActions: An array of ActionWithInput objects
   * - events: An array of EventWithInput objects
   * - groups: An array of BaseGroup objects
   * - state: An object with the following properties:
   *   - name: A string
   *   - description: A string
   *   -
   */
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
      // sonarignore:start
      // TODO: Refactor
      // sonarignore:start
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
            node: currentNode as BpmnAction,
            inputs: this.nodes.mapInputs(currentNode.prompts),
          };
          (currentNode as BpmnAction).isElseAction
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

  /**
   * It creates a new ProcessPropertiesElement, which is a class that extends the Element class, and
   * passes it the node and state
   * @param state - The state of the process.
   * @param node - The node that is being processed.
   * @returns A new ProcessPropertiesElement
   */
  private saveProperties(
    state: StateMap<RecordOfAnyType>,
    node: StatementNode<ModdleElement>,
  ) {
    return this.elements.createElementByName(
      ProcessPropertiesElement.name,
      node,
      {
        state,
      },
    );
  }

  /**
   * It gets the extension elements of the element, then gets the properties of the extension elements,
   * then sets the state of the property
   * @param {ModdleElement} element - ModdleElement - the element that we want to get the properties
   * from
   * @returns An object with the properties of the element.
   */
  private getProperties(element: ModdleElement) {
    const extension = element.get('extensionElements');
    const state: RecordOfAnyType = {};
    if (extension) {
      const properties = extension.get('values')[0];
      if (properties && properties['values']) {
        properties.get('values').forEach(property => {
          this.setState(property, state);
        });
      }
    }
    return state;
  }

  /**
   * It takes a property and a state object, and it sets the state object's value to the property's
   * value
   * @param {ModdleElement} property - ModdleElement - this is the property that is being set
   * @param {RecordOfAnyType} state - The state object that we're going to be updating.
   */
  private setState(property: ModdleElement, state: RecordOfAnyType) {
    const [id, key] = property['name'].split('_');
    if (state[id]) {
      try {
        state[id][key] = JSON.parse(property['value']);
      } catch (error) {
        state[id][key] = property['value'];
      }
    } else {
      state[id] = {
        [key]:
          key === 'email' ? JSON.parse(property['value']) : property['value'],
      };
    }
  }
}

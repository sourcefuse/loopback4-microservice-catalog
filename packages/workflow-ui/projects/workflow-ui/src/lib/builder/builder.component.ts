import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {
  isSelectInput,
  Statement,
  StatementNode,
  WorkflowAction,
  WorkflowEvent,
  WorkflowPrompt,
} from '../classes';
import {BaseGroup} from '../classes/nodes/abstract-base-group.class';
import {BuilderService, ElementService, NodeService} from '../classes/services';
import {ConditionTypes, NodeTypes, EventTypes} from '../enum';
import {InvalidEntityError} from '../errors/base.error';
import {
  ActionAddition,
  ActionWithInput,
  AllowedValues,
  AllowedValuesMap,
  ElementsWithInput,
  EventAddition,
  EventWithInput,
  InputChanged,
  NodeWithInput,
  RecordOfAnyType,
  Select,
  StateMap,
  WorkflowNode,
} from '../types';

@Component({
  selector: 'workflow-builder',
  templateUrl: './builder.component.html',
  styleUrls: [
    './builder.component.scss',
    '../../assets/icons/icomoon/style.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderComponent<E> implements OnInit {
  constructor(
    private readonly builder: BuilderService<E, RecordOfAnyType>,
    private readonly nodes: NodeService<E>,
    private readonly elements: ElementService<E>,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  @Input()
  state: StateMap<RecordOfAnyType> = {};

  @Input()
  diagram = '';

  @Input()
  templateMap?: {
    [key: string]: TemplateRef<RecordOfAnyType>;
  };

  @Input()
  allColumns: Select[];

  @Output()
  stateChange = new EventEmitter<StateMap<RecordOfAnyType>>();

  @Output()
  diagramChange = new EventEmitter<string>();

  @Output()
  eventAdded = new EventEmitter<EventAddition<E>>();

  @Output()
  actionAdded = new EventEmitter<ActionAddition<E>>();

  @Output()
  itemChanged = new EventEmitter<InputChanged<E>>();

  selectedElseActions: ActionWithInput<E>[] = [];
  selectedEvents: EventWithInput<E>[] = [];
  selectedActions: ActionWithInput<E>[] = [];

  eventGroups: BaseGroup<E>[] = [];
  actionGroups: BaseGroup<E>[] = [];
  eActionGroups: BaseGroup<E>[] = [];

  nodeList: BaseGroup<E>[] = [];
  processId: string;
  showElseBlock = true;
  public types = NodeTypes;

  /**
   * We're getting all the groups from the node service, and then we're adding them to the list of groups
   */
  ngOnInit(): void {
    this.nodes
      .getGroups(true, NodeTypes.EVENT)
      .forEach(group => this.onGroupAdd(group));
    this.nodes
      .getGroups(true, NodeTypes.ACTION)
      .forEach(group => this.onGroupAdd(group));
    this.nodes
      .getGroups(true, NodeTypes.ACTION, true)
      .forEach(group => this.eActionGroups.push(group));
  }

  /**
   * > If the diagram and state have changed, restore the diagram and state from the builder
   * @param {SimpleChanges} changes - SimpleChanges - the changes that have occurred in the component
   */
  async ngOnChanges(changes: SimpleChanges) {
    if (changes['diagram'] && changes['state'] && this.diagram && this.state) {
      const {events, actions, elseActions, groups, process, state} =
        await this.builder.restore(this.diagram);
      this.processId = process.id;

      this.eventGroups = [];
      this.actionGroups = [];
      this.selectedActions = actions;
      this.selectedEvents = events;
      this.selectedElseActions = elseActions;
      groups.forEach(group => this.onGroupAdd(group));
      this.restoreState(state);
      this.eActionGroups[0].children = elseActions;
      events.forEach(event => {
        const groupId = event.node.groupId;
        this.eventGroups.forEach(group => {
          if (group.id === groupId) {
            group.children.push(event);
          }
        });
        this.eventAdded.emit({
          name: event.node.constructor.name,
          event: event.node,
        });
      });
      actions.forEach(action => {
        const groupId = action.node.groupId;
        this.actionGroups.forEach(group => {
          if (group.id === groupId) {
            group.children.push(action);
          }
        });
        this.eventAdded.emit({
          name: action.node.constructor.name,
          event: action.node as unknown as WorkflowEvent<E>,
        });
      });
      if (this.eventGroups[0].children?.length) {
        this.showElseBlock =
          this.eventGroups[0].children[0].node.constructor.name ===
            EventTypes.OnChangeEvent &&
          this.eventGroups[0].children[0].node.state.get('condition') !==
            ConditionTypes.Changes;
      }
      this.updateDiagram();
    }
  }

  /**
   * If the group is an event, add it to the eventGroups array, otherwise if it's an action, add it to
   * the actionGroups array
   * @param group - BaseGroup<E>
   */
  onGroupAdd(group: BaseGroup<E>) {
    if (group.nodeType === NodeTypes.EVENT) {
      this.eventGroups.push(group);
    } else if (group.nodeType === NodeTypes.ACTION) {
      this.actionGroups.push(group);
    } else {
      throw new Error('Invalid Group');
    }
  }

  /**
   * The function takes in an index number, and then removes the event group at that index from the
   * eventGroups array
   * @param {number} index - The index of the group to remove.
   */
  onGroupRemove(index: number) {
    this.eventGroups.splice(index, 1);
  }

  /**
   * The function is called when an event is added to the workflow. It emits an eventAdded event,
   * updates the diagram, updates the state, and shows the else block
   * @param event - ElementsWithInput<E>
   */
  onEventAdded(event: ElementsWithInput<E>) {
    this.eventAdded.emit({
      name: event.node.constructor.name,
      event: event.newNode.node as WorkflowEvent<E>,
    });
    this.updateDiagram();
    this.updateState(event.node, event.newNode.inputs);
    this.showElseBlock =
      event.node.constructor.name === EventTypes.OnChangeEvent ||
      event.node.constructor.name === EventTypes.OnValueEvent;
  }

  /**
   * When an action is added, emit an event with the name of the action and the action itself, update
   * the diagram, and update the state of the action
   * @param action - ElementsWithInput<E>
   */
  onActionAdded(action: ElementsWithInput<E>) {
    this.actionAdded.emit({
      name: action.node.constructor.name,
      action: action.newNode.node as WorkflowAction<E>,
    });
    this.updateDiagram();
    this.updateState(action.node, action.newNode.inputs);
  }

  /**
   * The function is called when an item is changed in the UI. It emits an event to the parent
   * component, updates the state of the item, and updates the diagram
   * @param {RecordOfAnyType} item - RecordOfAnyType
   */
  onItemChanged(item: RecordOfAnyType) {
    this.itemChanged.emit({
      field: item.field,
      value: item.value,
      item: item.element.node,
    });
    this.updateState(item.element.node, item.element.inputs);
    if (this.eventGroups[0].children?.length) {
      this.showElseBlock =
        this.eventGroups[0].children[0].node.constructor.name ===
          EventTypes.OnChangeEvent &&
        this.eventGroups[0].children[0].node.state.get('condition') !==
          ConditionTypes.Changes;
    }
    this.updateDiagram();
  }

  /**
   * "If the type is a group, then get the groups, otherwise throw an error."
   *
   * The above function is a good example of how to use the enum
   * @param {NodeTypes} type - The type of node to be added.
   */
  openPopup(type: NodeTypes) {
    if (type === NodeTypes.GROUP) {
      this.nodeList = this.nodes.getGroups();
    } else {
      throw new InvalidEntityError('' + type);
    }
  }

  /**
   * It takes a state object, merges it with the current state, and then loops through the state object
   * and adds the values to the inputs
   * @param state - StateMap<RecordOfAnyType>
   */
  private restoreState(state: StateMap<RecordOfAnyType>) {
    state = this.mergeState(this.state, state);
    const allNodes = [
      ...this.selectedEvents,
      ...this.selectedActions,
      ...this.selectedElseActions,
    ];
    Object.keys(state).forEach(nodeId => {
      const node = allNodes.find(n => n.node.id === nodeId);
      if (node) {
        node.inputs.forEach(input => {
          if (state[node.node.id]?.hasOwnProperty(input.inputKey)) {
            if (isSelectInput(input)) {
              this.addValue(
                node,
                input,
                {
                  [input.listValueField]: state[node.node.id][input.inputKey],
                  [input.listNameField]:
                    state[node.node.id][`${input.inputKey}Name`],
                },
                true,
              );
            } else {
              this.addValue(node, input, state[node.node.id][input.inputKey]);
            }
          }
        });
      }
    });
    this.cdr.detectChanges();
  }

  /**
   * It takes a node, an input, a value, and a boolean, and if the boolean is true and the input is a
   * select input, it sets the node's state to the value's listNameField, emits an event, sets the
   * value to the value's listValueField, and then calls the handleSubsequentInputs function, emits
   * another event, calls the updateState function, and calls the updateDiagram function
   * @param element - NodeWithInput<E> - this is the node that the user is currently editing.
   * @param {WorkflowPrompt} input - WorkflowPrompt - this is the input that was changed
   * @param {AllowedValues | AllowedValuesMap} value - AllowedValues | AllowedValuesMap
   * @param [select=false] - boolean - if true, the value is a map of values, and the value to be set
   * is the value of the listValueField
   */
  addValue(
    element: NodeWithInput<E>,
    input: WorkflowPrompt,
    value: AllowedValues | AllowedValuesMap,
    select = false,
  ) {
    if (select && isSelectInput(input)) {
      element.node.state.change(
        `${input.inputKey}Name`,
        (value as AllowedValuesMap)[input.listNameField],
      );
      this.itemChanged.emit({
        field: input,
        value: (value as AllowedValuesMap)[input.listValueField],
        item: element.node,
      });
      value = (value as AllowedValuesMap)[input.listValueField];
    }
    element.node.state.change(input.inputKey, value);
    this.handleSubsequentInputs(element, input);
    this.itemChanged.emit({
      field: input,
      value: value,
      item: element.node,
    });
    this.updateState(element.node, element.inputs);
    this.updateDiagram();
  }

  /**
   * It takes the state of the workflow and creates a new statement from it
   * @returns A function that takes a state and returns a boolean.
   */
  build() {
    const statement = new Statement<E>(this.state);
    const elseStatement = new Statement<E>(this.state);
    if (this.processId) {
      statement.processId = this.processId;
    }

    [...this.eventGroups, ...this.actionGroups].forEach(group => {
      if (group.name === 'and') {
        group.children
          .map(e => e.node)
          .forEach(node => {
            node.elements.forEach(element => {
              const instance = this.elements.createInstance(element);
              statement.addNode(instance, node);
            });
          });
      } else if (group.name === 'or') {
        const statementNodes: StatementNode<E>[] = [];
        const elseNode = new StatementNode(
          this.elements.createInstanceByName('EGatewayElement'),
        );
        group.children
          .map(e => e.node)
          .forEach(node => {
            node.elements.forEach(element => {
              const instance = this.elements.createInstance(element);
              statementNodes.push(new StatementNode(instance, node));
            });
            elseNode.workflowNode = node;
          });
        statement.addNodes(statementNodes, elseNode);
      } else {
        throw new Error('Invalid Node type');
      }
    });

    if (this.eActionGroups[0].children.length > 0) {
      this.eActionGroups.forEach(group => {
        group.children
          .map(e => e.node)
          .forEach(node => {
            node.elements.forEach(element => {
              const instance = this.elements.createInstance(element);
              elseStatement.addNode(instance, node);
            });
          });
      });
    }
    return this.builder.build(statement, elseStatement);
  }

  /**
   * It builds a new diagram, emits the new diagram, and then tells Angular to update the view
   */
  async updateDiagram() {
    this.diagram = await this.build();
    this.diagramChange.emit(this.diagram);
    this.cdr.detectChanges();
  }

  /**
   * It updates the state of the workflow
   * @param node - WorkflowNode<E> - The node that is being updated.
   * @param {WorkflowPrompt[]} inputs - WorkflowPrompt[]
   * @param [remove=false] - boolean - if true, the state for the node will be removed
   */
  updateState(node: WorkflowNode<E>, inputs: WorkflowPrompt[], remove = false) {
    if (!this.state) {
      this.state = {};
    }
    if (remove) {
      delete this.state[node.id];
    } else {
      const keys = inputs.map(input => input.inputKey);
      this.state[node.id] = node.state.getAll([
        ...keys,
        ...keys.map(k => `${k}Name`),
      ]);
    }
    this.stateChange.emit(this.state);
  }

  /**
   * > If the user has already entered data for a subsequent input, remove it
   * @param element - NodeWithInput<E>
   * @param {WorkflowPrompt} input - WorkflowPrompt - this is the input that was just changed
   */
  private handleSubsequentInputs(
    element: NodeWithInput<E>,
    input: WorkflowPrompt,
  ) {
    const currentIndex = element.inputs.findIndex(
      i => i.constructor.name === input.constructor.name,
    );
    const subsequentInputs = element.inputs.filter((r, i) => i > currentIndex);
    for (const nextInput of subsequentInputs) {
      if (nextInput.prevchange) nextInput.prevchange(element.node.state);
      const nextKey = nextInput.inputKey;
      element.node.state.remove(nextKey);
      element.node.state.remove(`${nextKey}Name`);
    }
  }

  /**
   * It takes two objects, and merges the second object into the first object
   * @param stateA - The state that is currently in the store.
   * @param stateB - The state that you want to merge into stateA.
   * @returns The state of the store.
   */
  private mergeState<S>(stateA: StateMap<S>, stateB: StateMap<S>) {
    stateA = JSON.parse(JSON.stringify(stateA));
    Object.keys(stateB).forEach(id => {
      Object.keys(stateB[id]).forEach(key => {
        if (stateA[id]) {
          (stateA[id] as RecordOfAnyType)[key] = (stateB as RecordOfAnyType)[
            id
          ][key];
        } else {
          stateA[id] = stateB[id];
        }
      });
    });
    return stateA;
  }
}

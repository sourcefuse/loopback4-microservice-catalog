import {
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
import {NodeTypes} from '../enum';
import {InvalidEntityError} from '../errors/base.error';
import {
  ActionAddition,
  ActionWithInput,
  AllowedValues,
  AllowedValuesMap,
  EventAddition,
  EventWithInput,
  InputChanged,
  NodeWithInput,
  RecordOfAnyType,
  StateMap,
  WorkflowNode,
} from '../types';

@Component({
  selector: 'workflow-builder',
  templateUrl: './builder.component.html',
  styleUrls: [
    './builder.component.scss',
    '../../../assets/icons/icomoon/style.css',
  ],
})
export class BuilderComponent<E> implements OnInit {
  constructor(
    private readonly builder: BuilderService<E, RecordOfAnyType>,
    private readonly nodes: NodeService<E>,
    private readonly elements: ElementService<E>,
  ) {}

  @Input()
  state: StateMap<RecordOfAnyType> = {};

  @Input()
  diagram = '';

  @Input()
  templateMap?: {
    [key: string]: TemplateRef<RecordOfAnyType>;
  };

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
  public types = NodeTypes;

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
      });

      actions.forEach(action => {
        const groupId = action.node.groupId;
        this.actionGroups.forEach(group => {
          if (group.id === groupId) {
            group.children.push(action);
          }
        });
      });

      this.updateDiagram();
    }
  }

  onGroupAdd(group: BaseGroup<E>) {
    if (group.nodeType === NodeTypes.EVENT) {
      this.eventGroups.push(group);
    } else if (group.nodeType === NodeTypes.ACTION) {
      this.actionGroups.push(group);
    } else {
      throw new Error('Invalid Group');
    }
  }

  onGroupRemove(index: number) {
    this.eventGroups.splice(index, 1);
  }

  onEventAdded(event: any) {
    this.eventAdded.emit({
      name: event.node.constructor.name,
      event: event.newNode.node as WorkflowEvent<E>,
    });
    this.updateDiagram();
    this.updateState(event.node, event.newNode.inputs);
  }

  onActionAdded(action: any) {
    this.actionAdded.emit({
      name: action.node.constructor.name,
      action: action.newNode.node as WorkflowAction<E>,
    });
    this.updateDiagram();
    this.updateState(action.node, action.newNode.inputs);
  }

  onItemChanged(item: any) {
    this.itemChanged.emit({
      field: item.field,
      value: item.value,
      item: item.element.node,
    });
    this.updateState(item.element.node, item.element.inputs);
    this.updateDiagram();
  }

  openPopup(type: NodeTypes) {
    if (type === NodeTypes.GROUP) {
      this.nodeList = this.nodes.getGroups();
    } else {
      throw new InvalidEntityError('' + type);
    }
  }

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
  }

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

  build() {
    const statement = new Statement<E>(this.state);
    const elseStatement = new Statement<E>(this.state);
    if (this.processId) {
      statement.processId = this.processId;
    }

    [...this.eventGroups, ...this.actionGroups].forEach(group => {
      if (group.name === 'and') {
        [...group.children]
          .map(e => e.node)
          .forEach(node => {
            node.elements.forEach(element => {
              const instance = this.elements.createInstance(element);
              statement.addNode(instance, node);
            });
          });
      } else if (group.name === 'or') {
        const statementNodes: StatementNode<E>[] = [];
        [...group.children]
          .map(e => e.node)
          .forEach(node => {
            node.elements.forEach(element => {
              const instance = this.elements.createInstance(element);
              statementNodes.push(new StatementNode(instance, node));
            });
          });
        statement.addNodes(statementNodes);
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

  async updateDiagram() {
    this.diagram = await this.build();
    this.diagramChange.emit(this.diagram);
  }

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

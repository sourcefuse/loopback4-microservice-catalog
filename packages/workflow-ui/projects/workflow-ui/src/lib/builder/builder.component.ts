import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  Statement,
  StatementNode,
  WorkflowAction,
  WorkflowEvent,
  WorkflowPrompt,
} from '../classes';
import { BaseGroup } from '../classes/nodes/abstract-base-group.class';
import { BuilderService, ElementService, NodeService } from '../classes/services';
import { NodeTypes } from '../enum';
import { InvalidEntityError } from '../errors/base.error';
import {
  ActionAddition,
  ActionWithInput,
  EventAddition,
  EventWithInput,
  InputChanged,
  RecordOfAnyType,
  StateMap,
  WorkflowNode,
} from '../types';

@Component({
  selector: 'workflow-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent<E> implements OnInit {
  constructor(
    private readonly builder: BuilderService<E, RecordOfAnyType>,
    private readonly nodes: NodeService<E>,
    private readonly elements: ElementService<E>,
  ) { }

  @Input()
  state: StateMap<RecordOfAnyType> = {};

  @Input()
  diagram = '';

  // @Input()
  // templateMap?: {
  //   [key: string]: TemplateRef<RecordOfAnyType>;
  // };

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

  // @ViewChild('nodePopup')
  // nodePopup: TemplateRef<RecordOfAnyType>;

  // @ViewChild('listTemplate')
  // listTemplate: TemplateRef<RecordOfAnyType>;

  // @ViewChild('numberTemplate')
  // numberTemplate: TemplateRef<RecordOfAnyType>;

  // @ViewChild('textTemplate')
  // textTemplate: TemplateRef<RecordOfAnyType>;

  events: WorkflowNode<E>[] = [];
  triggerEvents: WorkflowNode<E>[] = [];
  actions: WorkflowNode<E>[] = [];

  selectedEvents: EventWithInput<E>[] = [];
  selectedActions: ActionWithInput<E>[] = [];

  eventGroups: BaseGroup<E>[] = [];
  actionGroups: BaseGroup<E>[] = [];

  nodeList: BaseGroup<E>[] = [];
  processId: string;
  public types = NodeTypes;

  ngOnInit(): void {
    this.events = this.nodes.getEvents();
    this.triggerEvents = this.nodes.getEvents(true);
    this.actions = this.nodes.getActions();

    this.nodes.getGroups(true, NodeTypes.EVENT).forEach(group => this.onGroupAdd(group));
    this.nodes.getGroups(true, NodeTypes.ACTION).forEach(group => this.onGroupAdd(group));
  }

  // async ngOnChanges(changes: SimpleChanges) {
  //   if (changes['diagram'] && changes['state'] && this.diagram && this.state) {
  //     const { events, actions, process, state } = await this.builder.restore(
  //       this.diagram,
  //     );
  //     this.processId = process.id;
  //     events.forEach(event => this.onNodeAdd(event, event.id));
  //     actions.forEach(action => this.onNodeAdd(action, action.id));
  //     this.restoreState(state);
  //   }
  // }

  onGroupAdd(group: BaseGroup<E>) {
    if (group.nodeType === NodeTypes.EVENT) {
      this.eventGroups.push(group);
    }
    else if (group.nodeType === NodeTypes.ACTION) {
      this.actionGroups.push(group);
    }
    else {
      throw new Error('Invalid Group');
    }
  }

  onGroupRemove(index: number) {
    this.eventGroups.splice(index, 1);
  }

  onEventAdded(event: any) {
    this.eventAdded.emit({
      name: event.node.constructor.name,
      event: event.newNode.node as WorkflowEvent<E>
    });
    this.updateDiagram();
    this.updateState(event.node, event.newNode.inputs);
  }

  onActionAdded(action: any) {
    this.actionAdded.emit({
      name: action.node.constructor.name,
      action: action.newNode.node as WorkflowAction<E>
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
      throw new InvalidEntityError("" + type);
    }
  }


  // private restoreState(state: StateMap<RecordOfAnyType>) {
  //   state = this.mergeState(this.state, state);
  //   const allNodes = [...this.selectedEvents, ...this.selectedActions];
  //   Object.keys(state).forEach(nodeId => {
  //     const node = allNodes.find(n => n.node.id === nodeId);
  //     if (node) {
  //       node.inputs.forEach(input => {
  //         if (state[node.node.id]?.hasOwnProperty(input.inputKey)) {
  //           if (isSelectInput(input)) {
  //             this.addValue(
  //               node,
  //               input,
  //               {
  //                 [input.listValueField]: state[node.node.id][input.inputKey],
  //                 [input.listNameField]:
  //                   state[node.node.id][`${input.inputKey}Name`],
  //               },
  //               true,
  //             );
  //           } else {
  //             this.addValue(node, input, state[node.node.id][input.inputKey]);
  //           }
  //         }
  //       });
  //     }
  //   });
  // }



  build() {
    const statement = new Statement<E>(this.state);
    if (this.processId) {
      statement.processId = this.processId;
    }

    [...this.eventGroups, ...this.actionGroups]
      .forEach(group => {
        if (group.name === 'and') {
          [...group.children]
            .map(e => e.node)
            .forEach(node => {
              node.elements.forEach(element => {
                const instance = this.elements.createInstance(element);
                statement.addNode(instance, node);
              })
            })
        } else if (group.name === 'or') {
          const statementNodes: StatementNode<E>[] = [];
          [...group.children]
            .map(e => e.node)
            .forEach(node => {
              node.elements.forEach(element => {
                const instance = this.elements.createInstance(element);
                statementNodes.push(new StatementNode(instance, node));
              })
            })
          statement.addNodes(statementNodes);
        } else {
          throw new Error('Invalid Node type');
        }
      })
    console.log(statement);

    return this.builder.build(statement);
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


  // private mergeState<S>(stateA: StateMap<S>, stateB: StateMap<S>) {
  //   stateA = JSON.parse(JSON.stringify(stateA));
  //   Object.keys(stateB).forEach(id => {
  //     Object.keys(stateB[id]).forEach(key => {
  //       if (stateA[id]) {
  //         (stateA[id] as RecordOfAnyType)[key] = (stateB as RecordOfAnyType)[
  //           id
  //         ][key];
  //       } else {
  //         stateA[id] = stateB[id];
  //       }
  //     });
  //   });
  //   return stateA;
  // }

}

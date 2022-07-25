import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {NgxPopperjsContentComponent} from 'ngx-popperjs';
import {
  isSelectInput,
  Statement,
  WorkflowEvent,
  WorkflowPrompt,
} from '../classes';
import {BuilderService, ElementService, NodeService} from '../classes/services';
import {InputTypes, NodeTypes} from '../enum';
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
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent<E> implements OnInit, OnChanges {
  constructor(
    private readonly builder: BuilderService<E, RecordOfAnyType>,
    private readonly nodes: NodeService<E>,
    private readonly elements: ElementService<E>,
  ) {}

  /* A processId that is passed in from the parent component. */
  @Input()
  processId: string;

  /* state of the workflow statement */
  @Input()
  state: StateMap<RecordOfAnyType> = {};

  /* the xml diagram */
  @Input()
  diagram = '';

  /* A map of templates that can be used to render the inputs. */
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

  @ViewChild('nodePopup')
  nodePopup: TemplateRef<RecordOfAnyType>;

  @ViewChild('listTemplate')
  listTemplate: TemplateRef<RecordOfAnyType>;

  @ViewChild('numberTemplate')
  numberTemplate: TemplateRef<RecordOfAnyType>;

  @ViewChild('textTemplate')
  textTemplate: TemplateRef<RecordOfAnyType>;

  events: WorkflowNode<E>[] = [];
  triggerEvents: WorkflowNode<E>[] = [];
  actions: WorkflowNode<E>[] = [];

  selectedEvents: EventWithInput<E>[] = [];
  selectedActions: ActionWithInput<E>[] = [];

  nodeList: WorkflowNode<E>[] = [];
  public types = NodeTypes;

  ngOnInit(): void {
    this.events = this.nodes.getEvents();
    this.triggerEvents = this.nodes.getEvents(true);
    this.actions = this.nodes.getActions();
  }

  ngAfterViewInit() {
    if (!this.templateMap) {
      this.templateMap = {
        [InputTypes.Boolean]: this.listTemplate,
        [InputTypes.List]: this.listTemplate,
        [InputTypes.Text]: this.textTemplate,
        [InputTypes.Number]: this.numberTemplate,
        [InputTypes.Percentage]: this.numberTemplate,
        [InputTypes.Date]: this.textTemplate,
        [InputTypes.People]: this.listTemplate,
        [InputTypes.Interval]: this.listTemplate,
      };
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['diagram'] && changes['state'] && this.diagram && this.state) {
      const {events, actions, process, state} = await this.builder.restore(
        this.diagram,
      );
      this.processId = process.id;
      events.forEach(event => this.onNodeAdd(event, event.id));
      actions.forEach(action => this.onNodeAdd(action, action.id));
      this.restoreState(state);
    }
  }

  /**
   * It adds a node to the diagram and emits an event
   * @param node - WorkflowNode<E> - The node that was added
   * @param {string} [id] - The id of the node to be added. If not provided, a random uuid
   * will be used.
   */
  onNodeAdd(node: WorkflowNode<E>, id?: string) {
    const newNode = {
      node: this.nodes.getNodeByName(node.constructor.name, id),
      inputs: this.nodes.mapInputs(node.prompts),
    };
    if (node.type === NodeTypes.EVENT) {
      this.selectedEvents.push(newNode as EventWithInput<E>);
      this.eventAdded.emit({
        name: node.constructor.name,
        event: newNode.node as WorkflowEvent<E>,
      });
    } else if (node.type === NodeTypes.ACTION) {
      this.selectedActions.push(newNode);
      this.actionAdded.emit({
        name: node.constructor.name,
        action: newNode.node,
      });
    } else {
      throw new InvalidEntityError('Node');
    }
    this.updateDiagram();
    this.updateState(node, newNode.inputs);
  }

  /**
   * It removes a node from the selected nodes array and updates the diagram
   * @param {NodeTypes} type - NodeTypes - This is the type of node that was removed.
   * @param {number} index - The index of the node in the array of nodes.
   */
  onNodeRemove(type: NodeTypes, index: number) {
    let node: NodeWithInput<E>;
    if (type === NodeTypes.ACTION) {
      [node] = this.selectedActions.splice(index, 1);
    } else if (type === NodeTypes.EVENT) {
      [node] = this.selectedEvents.splice(index, 1);
    } else {
      throw new InvalidEntityError('Node');
    }
    this.updateDiagram();
    this.updateState(node.node, node.inputs, true);
  }

  /**
   * If the type is an action, then set the node list to the actions, otherwise if the type is an event,
   * then set the node list to the events, otherwise throw an error
   * @param {NodeTypes} type - NodeTypes - This is the type of node that we want to add to the graph.
   */
  openPopup(type: NodeTypes) {
    if (type === NodeTypes.ACTION) {
      this.nodeList = this.actions;
    } else if (type === NodeTypes.EVENT) {
      this.nodeList =
        this.selectedEvents.length > 0 ? this.events : this.triggerEvents;
    } else {
      throw new InvalidEntityError(type);
    }
  }

  /**
   * It adds a value to a node
   * @param element - NodeWithInput<E> - this is the node that the input is on
   * @param {WorkflowPrompt} input - WorkflowPrompt - this is the input field that was changed
   * @param {AllowedValues | AllowedValuesMap} value - AllowedValues | AllowedValuesMap
   * @param [select=false] - boolean - if true, the value is a map of values, and the value to be set is
   * the value of the listValueField
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
   * It takes a state object, and for each node in the state object, it finds the corresponding node in
   * the graph, and then for each input in the node, it adds the value from the state object to the input
   * @param state - StateMap<RecordOfAnyType>
   */
  private restoreState(state: StateMap<RecordOfAnyType>) {
    state = this.mergeState(this.state, state);
    const allNodes = [...this.selectedEvents, ...this.selectedActions];
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
   * It creates a new statement, adds all the selected nodes to it, and then returns the result of the
   * builder's build function
   * @returns A statement object
   */
  build() {
    const statement = new Statement<E>(this.state);
    if (this.processId) {
      statement.processId = this.processId;
    }
    [...this.selectedEvents, ...this.selectedActions]
      .map(e => e.node)
      .forEach(node => {
        node.elements.forEach(element => {
          const instance = this.elements.createInstance(element);
          statement.addNode(instance, node);
        });
      });

    return this.builder.build(statement);
  }

  /**
   * It updates the diagram by building it and emitting the diagram change event
   */
  async updateDiagram() {
    this.diagram = await this.build();
    this.diagramChange.emit(this.diagram);
  }

  /**
   * It takes a node, a list of inputs, and a boolean flag, and then either removes the node's state from
   * the workflow's state or adds it to the workflow's state
   * @param node - WorkflowNode<E> - The node that is being updated.
   * @param {WorkflowPrompt[]} inputs - WorkflowPrompt[]
   * @param [remove=false] - boolean - if true, the node's state will be removed from the workflow state.
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
   * It creates a callback function that will be called when the user clicks on a button in the popper
   * @param element - The element that was clicked on.
   * @param {WorkflowPrompt} input - The input object that was clicked on.
   * @param {NgxPopperjsContentComponent} popper - NgxPopperjsContentComponent
   * @returns A function that takes a value and adds it to the element.
   */
  createCallback(
    element: NodeWithInput<E>,
    input: WorkflowPrompt,
    popper: NgxPopperjsContentComponent,
  ) {
    return (value?: AllowedValues) => {
      if (value) {
        this.addValue(
          element,
          input,
          value,
          input.typeFunction(element.node.state) === InputTypes.List,
        );
      }
      popper.hide();
    };
  }

  /**
   * It takes two objects, and merges the second object into the first object
   * @param stateA - The current state of the component.
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

  /**
   * "If the target is not null, return the value of the target as an HTMLInputElement, otherwise throw
   * an InvalidEntityError."
   *
   * The first thing to notice is that the function takes a parameter of type EventTarget. This is a type
   * that is defined in the DOM API. It is the type of the target property of the Event interface
   * @param {EventTarget | null} target - EventTarget | null
   * @returns The value of the input element.
   */
  getInputValue(target: EventTarget | null) {
    if (target) {
      return (target as HTMLInputElement).value;
    } else {
      throw new InvalidEntityError('Event');
    }
  }
}

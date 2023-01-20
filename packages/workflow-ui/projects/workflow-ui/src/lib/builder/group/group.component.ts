import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {NgxPopperjsContentComponent} from 'ngx-popperjs';
import {
  isSelectInput,
  NodeService,
  WorkflowElement,
  WorkflowPrompt,
} from '../../classes';
import {BaseGroup} from '../../classes/nodes/abstract-base-group.class';
import {ConditionTypes, InputTypes, NodeTypes, NUMBER} from '../../enum';
import {InvalidEntityError} from '../../errors/base.error';
import {
  AllowedValues,
  AllowedValuesMap,
  NodeWithInput,
  RecordOfAnyType,
  WorkflowNode,
} from '../../types';
import {
  EventWithInput,
  ActionWithInput,
  DateTime,
  EmailInput,
  Select,
  Constructor,
  DateType,
} from '../../types/base.types';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {
  GatewayElement,
  ReadColumnValue,
  TriggerWhenColumnChanges,
} from '../../services';
@Component({
  selector: 'workflow-group',
  templateUrl: './group.component.html',
  styleUrls: [
    './group.component.scss',
    '../../../assets/icons/icomoon/style.css',
  ],
})
export class GroupComponent<E> implements OnInit {
  constructor(private readonly nodes: NodeService<E>) {}

  @Input()
  group: BaseGroup<E>;

  @Input()
  isLast = false;

  @Input()
  isFirst = false;

  @Input()
  eventGroups: BaseGroup<E>[];

  @Input()
  nodeType: NodeTypes;

  /* A decorator that tells Angular that the popupTemplate property is an input property. */
  @Input()
  popupTemplate!: NgxPopperjsContentComponent;

  @Output()
  remove = new EventEmitter<boolean>();

  @Output()
  add = new EventEmitter<boolean>();

  @Output()
  eventAdded = new EventEmitter<unknown>();

  @Output()
  actionAdded = new EventEmitter<unknown>();

  @Output()
  itemChanged = new EventEmitter<unknown>();

  date: DateType = {month: 0, day: 0, year: 0};
  dateTime: DateTime = {
    date: {month: 0, day: 0, year: 0},
    time: {hour: null, minute: null},
  };
  emailInput: EmailInput = {
    subject: '',
    body: '',
    focusKey: '',
  };
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableCheckAll: true,
    itemsShowLimit: 2,
    allowSearchFilter: true,
    defaultOpen: true,
  };
  selectedItems = [];
  showDateTimePicker = true;
  enableActionIcon = true;
  events: WorkflowNode<E>[] = [];
  triggerEvents: WorkflowNode<E>[] = [];
  actions: WorkflowNode<E>[] = [];

  nodeList: WorkflowNode<E>[];

  public types = NodeTypes;
  public prevPopperRef: NgxPopperjsContentComponent;

  @Input()
  templateMap?: {
    [key: string]: TemplateRef<RecordOfAnyType>;
  };

  @Input()
  allColumns: Select[];

  @ViewChild('emailTemplate') emailTemplate: TemplateRef<RecordOfAnyType>;

  @ViewChild('listTemplate')
  listTemplate: TemplateRef<RecordOfAnyType>;

  @ViewChild('numberTemplate')
  numberTemplate: TemplateRef<RecordOfAnyType>;

  @ViewChild('textTemplate')
  textTemplate: TemplateRef<RecordOfAnyType>;

  @ViewChild('searchableDropdownTemplate')
  searchableDropdownTemplate: TemplateRef<RecordOfAnyType>;

  @ViewChild('dateTemplate')
  dateTemplate: TemplateRef<RecordOfAnyType>;

  @ViewChild('dateTimeTemplate')
  dateTimeTemplate: TemplateRef<RecordOfAnyType>;

  /**
   * It gets the events and actions from the nodes service and stores them in the events and actions
   * variables
   */
  ngOnInit(): void {
    this.events = this.nodes.getEvents();
    this.triggerEvents = this.nodes.getEvents(true);
    this.actions = this.nodes.getActions();
  }

  /**
   * If the user has provided a custom template for a given input type, use that template. Otherwise,
   * use the default template
   */
  ngAfterViewInit() {
    this.templateMap = {
      [InputTypes.Boolean]:
        this.templateMap?.[InputTypes.Boolean] || this.listTemplate,
      [InputTypes.List]:
        this.templateMap?.[InputTypes.List] || this.listTemplate,
      [InputTypes.Text]:
        this.templateMap?.[InputTypes.Text] || this.textTemplate,
      [InputTypes.Number]:
        this.templateMap?.[InputTypes.Number] || this.numberTemplate,
      [InputTypes.Percentage]:
        this.templateMap?.[InputTypes.Percentage] || this.numberTemplate,
      [InputTypes.Date]:
        this.templateMap?.[InputTypes.Date] || this.dateTemplate,
      [InputTypes.DateTime]:
        this.templateMap?.[InputTypes.DateTime] || this.dateTimeTemplate,
      [InputTypes.People]:
        this.templateMap?.[InputTypes.People] ||
        this.searchableDropdownTemplate,
      [InputTypes.Interval]:
        this.templateMap?.[InputTypes.Interval] || this.listTemplate,
      [InputTypes.Email]:
        this.templateMap?.[InputTypes.Email] || this.emailTemplate,
    };
  }

  /**
   * If the input is a value input, then set the value of the input to the value of the node
   * @param {WorkflowPrompt} input - WorkflowPrompt - The input that was passed in from the workflow.
   * @param nodeWithInput - The node that has the input.
   */
  setInput(input: WorkflowPrompt, nodeWithInput: NodeWithInput<E>) {
    const allowedInputs = ['ValueInput', 'EmailDataInput', 'ToValueInput'];
    if (allowedInputs.includes(input.constructor.name)) {
      const value = input.getModelValue(nodeWithInput.node.state);
      if (nodeWithInput.node.state.get('email')) {
        this.emailInput = value;
      } else {
        switch (nodeWithInput.node.state.get('valueInputType')) {
          case InputTypes.Date:
            this.date = value;
            break;
          case InputTypes.DateTime:
            this.dateTime = value;
            break;
          case InputTypes.People:
            this.selectedItems = value;
            break;
        }
      }
    }
  }

  /**
   * The removeClick() function emits a boolean value of true to the parent component
   */
  removeClick() {
    this.remove.emit(true);
  }

  /**
   * The addClick() function emits the add event, which is a boolean value of true
   */
  addClick() {
    this.add.emit(true);
  }

  /**
   * If the focusKey is subject, append the value of the item to the subject. If the focusKey is body,
   * append the value of the item to the body
   * @param {Select} item - Select - this is the item that was selected from the dropdown
   * @param {EmailInput} emailInput - EmailInput - this is the object that contains the email input
   * values.
   */
  appendEmailBody(item: Select, emailInput: EmailInput) {
    if (emailInput.focusKey === 'subject') {
      emailInput.subject += ` ${item.value}`;
    }
    if (emailInput.focusKey === 'body') {
      emailInput.body += ` ${item.value}`;
    }
  }

  /**
   * Set the focus key of the email input to the key.
   * @param {EmailInput} emailInput - EmailInput - This is the email input object that you created in
   * the previous step.
   * @param {string} key - The key of the input.
   */
  setFocusKey(emailInput: EmailInput, key: string) {
    emailInput.focusKey = key;
  }

  /**
   * If the type is an action, set the node list to the actions, otherwise if the type is an event, set
   * the node list to the trigger events if there is only one event group and no children, otherwise
   * set the node list to the events
   * @param {NodeTypes} type - NodeTypes
   */
  openPopup(type: NodeTypes) {
    if (type === NodeTypes.ACTION) {
      this.nodeList = this.actions;
    } else if (type === NodeTypes.EVENT) {
      this.nodeList =
        this.eventGroups.length === 1 && !this.group.children.length
          ? this.triggerEvents
          : this.events;
    } else {
      throw new InvalidEntityError('' + type);
    }
  }

  /**
   * `onNodeAdd` is a function that takes in a node, a group type, a group id, and an id, and then
   * emits an event with a node and a new node
   * @param node - The node that was added.
   * @param {string} groupType - string - The type of group that the node is being added to.
   * @param {string} groupId - The id of the group that the node is being added to.
   * @param {string} [id] - The id of the node.
   */
  onNodeAdd(
    node: WorkflowNode<E>,
    groupType: string,
    groupId: string,
    id?: string,
  ) {
    const newNode = {
      node: this.nodes.getNodeByName(
        node.constructor.name,
        groupType,
        groupId,
        id,
        this.group.isElseGroup,
      ),
      inputs: this.nodes.mapInputs(node.prompts),
    };
    if (node.type === NodeTypes.EVENT) {
      this.eventAdded.emit({
        node: node,
        newNode: newNode,
      });
      if (newNode.node.constructor.name === 'OnIntervalEvent') {
        newNode.node.state.change('valueInputType', 'number');
      }
      this.group.children.push(newNode as EventWithInput<E>);
    } else if (node.type === NodeTypes.ACTION) {
      this.actionAdded.emit({
        node: node,
        newNode: newNode,
      });
      this.group.children.push(newNode as ActionWithInput<E>);
    } else {
      throw new InvalidEntityError('Node');
    }
  }

  /**
   * It removes the node at the given index from the group
   * @param {number} index - The index of the node that was removed.
   */
  onNodeRemove(index: number) {
    this.group.children.splice(index, 1);
  }

  /**
   * It takes in an element, an input, and a popper, and returns a function that takes in a value, and
   * if that value is defined, it adds the value to the element, and hides the popper
   * @param element - NodeWithInput<E>
   * @param {WorkflowPrompt} input - WorkflowPrompt - this is the input object that was clicked on
   * @param {NgxPopperjsContentComponent} popper - NgxPopperjsContentComponent
   * @returns A function that takes a value and returns a function that takes a value and emits an event
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
          input.setValue(element.node.state, value),
          input.typeFunction(element.node.state) === InputTypes.List,
        );
      }
      popper.hide();
    };
  }

  /**
   * It hides the previous popper and shows the current popper.
   * @param {MouseEvent} event - MouseEvent - The event that triggered the popper to show.
   * @param {NgxPopperjsContentComponent} popper - NgxPopperjsContentComponent - this is the popper
   * component that you want to show/hide.
   */
  onPoperClick(event: MouseEvent, popper: NgxPopperjsContentComponent) {
    this.prevPopperRef?.hide();
    this.prevPopperRef = popper;
    event.preventDefault();
    event.stopPropagation();
    this.prevPopperRef.show();
    popper?.popperInstance?.forceUpdate();
  }

  /**
   * It returns a function that hides the previous popper
   * @returns A function that calls the hide method on the previous popper reference.
   */
  hidePopper() {
    return () => {
      this.prevPopperRef?.hide();
    };
  }

  /**
   * It takes in a node, an input, a value, and a boolean, and then it changes the state of the node
   * based on the input and value
   * @param element - NodeWithInput<E> - The element that is being changed.
   * @param {WorkflowPrompt} input - WorkflowPrompt - this is the input that was changed
   * @param {AllowedValues | AllowedValuesMap} value - AllowedValues | AllowedValuesMap,
   * @param [select=false] - boolean - This is a flag that tells the function whether the input is a
   * select input or not.
   */
  addValue(
    element: NodeWithInput<E>,
    input: WorkflowPrompt,
    value: AllowedValues | AllowedValuesMap,
    select = false,
  ) {
    this.enableActionIcon = true;
    if (
      input.constructor.name === 'ConditionInput' &&
      element.node.constructor.name === 'OnChangeEvent'
    ) {
      if ((value as AllowedValuesMap).value === ConditionTypes.Changes) {
        /**
         * Remove node on changes event
         */
        element.node.elements.splice(-NUMBER.TWO, NUMBER.TWO);
        element.inputs[1].prefix = '';
        this.enableActionIcon = false;
      } else {
        element.node.elements = [
          TriggerWhenColumnChanges,
          ReadColumnValue,
          GatewayElement,
        ] as unknown as Constructor<WorkflowElement<E>>[];
      }
    }
    if (select && isSelectInput(input)) {
      if (
        element.node.state.get('columnName') === 'Priority' &&
        input.inputKey !== 'condition'
      ) {
        element.node.state.change(
          `${input.inputKey}Name`,
          value as AllowedValuesMap,
        );
        this.itemChanged.emit({
          field: input,
          value: value as AllowedValuesMap,
          element: element,
        });
        value = value as AllowedValuesMap;
      } else {
        element.node.state.change(
          `${input.inputKey}Name`,
          (value as AllowedValuesMap)[input.listNameField],
        );
        this.itemChanged.emit({
          field: input,
          value: (value as AllowedValuesMap)[input.listValueField],
          element: element,
        });
        value = (value as AllowedValuesMap)[input.listValueField];
      }
    }
    element.node.state.change(input.inputKey, value);
    this.handleSubsequentInputs(element, input);
    this.itemChanged.emit({
      field: input,
      value: value,
      element: element,
    });
    this.enableActionIcon =
      element.node.state.get('condition') !== ConditionTypes.Changes;
  }

  /**
   * It removes all the inputs that come after the current input
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
}

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
  ElementService,
  isSelectInput,
  NodeService,
  WorkflowPrompt,
} from '../../classes';
import {BaseGroup} from '../../classes/nodes/abstract-base-group.class';
import {InputTypes, NodeTypes} from '../../enum';
import {InvalidEntityError} from '../../errors/base.error';
import {
  AllowedValues,
  AllowedValuesMap,
  NodeWithInput,
  RecordOfAnyType,
  WorkflowNode,
} from '../../types';
import {EventWithInput, ActionWithInput} from '../../types/base.types';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import * as moment from 'moment';
@Component({
  selector: 'workflow-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent<E> implements OnInit {
  constructor(
    private readonly nodes: NodeService<E>,
    private readonly elements: ElementService<E>,
  ) {}

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

  @Input()
  popupTemplate!: NgxPopperjsContentComponent;

  @Output()
  remove = new EventEmitter<boolean>();

  @Output()
  add = new EventEmitter<boolean>();

  @Output()
  eventAdded = new EventEmitter<any>();

  @Output()
  actionAdded = new EventEmitter<any>();

  @Output()
  itemChanged = new EventEmitter<any>();

  dateTime = {date: {month: null, day: null, year: null}, time: {hour: null, minute: null}};
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableCheckAll: true,
    itemsShowLimit: 1,
    allowSearchFilter: true,
    defaultOpen: true,
  };
  showDateTimePicker = true;

  events: WorkflowNode<E>[] = [];
  triggerEvents: WorkflowNode<E>[] = [];
  actions: WorkflowNode<E>[] = [];

  nodeList: WorkflowNode<E>[];

  public types = NodeTypes;

  @Input()
  templateMap?: {
    [key: string]: TemplateRef<RecordOfAnyType>;
  };

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

  ngOnInit(): void {
    this.events = this.nodes.getEvents();
    this.triggerEvents = this.nodes.getEvents(true);
    this.actions = this.nodes.getActions();
  }

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
        this.templateMap?.[InputTypes.DateTime] || this.dateTemplate,
      [InputTypes.DateTime]:
        this.templateMap?.[InputTypes.DateTime] || this.dateTimeTemplate,
      [InputTypes.People]:
        this.templateMap?.[InputTypes.People] ||
        this.searchableDropdownTemplate,
      [InputTypes.Interval]:
        this.templateMap?.[InputTypes.Interval] || this.listTemplate,
    };
  }

  removeClick() {
    this.remove.emit(true);
  }

  addClick() {
    this.add.emit(true);
  }

  openPopup(type: NodeTypes) {
    if (type === NodeTypes.ACTION) {
      this.nodeList = this.actions;
    } else if (type === NodeTypes.EVENT) {
      this.nodeList =
        this.eventGroups.length === 1 ? this.triggerEvents : this.events;
    } else {
      throw new InvalidEntityError('' + type);
    }
  }

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

  onNodeRemove(index: number) {
    this.group.children.splice(index, 1);
  }

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

  getInputValue(target: EventTarget | null) {
    if (target) {
      return (target as HTMLInputElement).value;
    } else {
      throw new InvalidEntityError('Event');
    }
  }

  onSelect(items: any) {
    const ids: string[] = [];
    const value: Array<any> = [];
    let displayValue = '';
    if (Array.isArray(items)) {
      displayValue = items
        .map((item: {id: string; fullName: string}) => {
          if (item.id) {
            ids.push(item.id);
            value.push({text: item.fullName, value: item.id});
          }
          return item.fullName;
        })
        .join(', ');
    } else {
      displayValue = items.fullName;
    }
    return {
      displayValue,
      ids,
      value,
    };
  }

  onDateSelect(date: any) {
    const year = date.year;
    const month = this.convertToTwoDigits(date.month);
    const day = this.convertToTwoDigits(date.day);
    return `${day}-${month}-${year}`;
  }

  onDateTimeSelect() {
    const {date, time} = this.dateTime;
    if(!time.hour || !time.minute) return;
    const hours = this.convertToTwoDigits(time.hour);
    const min = this.convertToTwoDigits(time.minute);
    const dateTime = `${this.onDateSelect(date)} ${hours}:${min}`;
    return moment(dateTime.toString()).format();
  }

  convertToTwoDigits(value: any) {
    return value <= 9 ? '0' + value : value;
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
        element: element,
      });
      value = (value as AllowedValuesMap)[input.listValueField];
    }
    const displayValue =
      typeof value === 'object'
        ? (value as AllowedValuesMap)['displayValue']
        : value;
    element.node.state.change(input.inputKey, displayValue);
    this.handleSubsequentInputs(element, input);
    this.itemChanged.emit({
      field: input,
      value: value,
      element: element,
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
}

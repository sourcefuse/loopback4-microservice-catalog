import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { NgxPopperjsContentComponent } from "ngx-popperjs";
import { ElementService, isSelectInput, NodeService, WorkflowEvent, WorkflowPrompt } from "../../classes";
import { BaseGroup } from "../../classes/nodes/abstract-base-group.class";
import { InputTypes, NodeTypes } from "../../enum";
import { InvalidEntityError } from "../../errors/base.error";
import { ActionAddition, AllowedValues, AllowedValuesMap, EventAddition, InputChanged, NodeWithInput, RecordOfAnyType, WorkflowNode } from "../../types";

@Component({
    selector: 'workflow-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss'],
})
export class GroupComponent<E> implements OnInit {
    constructor(
        private readonly nodes: NodeService<E>,
        private readonly elements: ElementService<E>,
    ) { }

    @Input()
    group: BaseGroup<E>;

    @Input()
    isLast = false;

    @Input()
    isFirst = false;

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
                this.group.children.length > 0 ? this.events : this.triggerEvents;
        } else {
            throw new InvalidEntityError("" + type);
        }
    }

    onNodeAdd(node: WorkflowNode<E>, id?: string) {
        const newNode = {
            node: this.nodes.getNodeByName(node.constructor.name, id),
            inputs: this.nodes.mapInputs(node.prompts),
        };
        if (node.type === NodeTypes.EVENT) {
            // this.eventAdded.emit({
            //     name: node.constructor.name,
            //     event: newNode.node as WorkflowEvent<E>
            // });
            this.eventAdded.emit({
                node: node,
                newNode: newNode
            });
            this.group.children.push(newNode);
        } else if (node.type === NodeTypes.ACTION) {
            this.actionAdded.emit({
                node: node,
                newNode: newNode
            });
            this.group.children.push(newNode);
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
        element.node.state.change(input.inputKey, value);
        this.handleSubsequentInputs(element, input);
        // this.itemChanged.emit({
        //     field: input,
        //     value: value,
        //     item: element.node,
        // });
        this.itemChanged.emit({
            field: input,
            value: value,
            element: element,
        });
        // this.updateState(element.node, element.inputs);
        // this.updateDiagram();
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

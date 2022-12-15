import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import BPMNModdle from 'bpmn-moddle';
import {CustomBpmnModdle} from './types/bpmn.types';
import {CAMUNDA} from './schema/camunda.json';
import {BpmnElementService} from './services/bpmn/element.service';
import {AutoLayoutService} from './layout/layout.service';
import {DiFactoryService} from './layout/di.service';
import {NgxPopperjsModule} from 'ngx-popperjs';
import {StartElement} from './services/bpmn/elements/base/start.element';
import {EndElement} from './services/bpmn/elements/base/end.element';
import {GatewayElement} from './services/bpmn/elements/gateways/gateway.element';
import {ProcessElement} from './services/bpmn/elements/process/process.element';
import {
  BASE_XML,
  BASE_XML_VALUE,
  BPMN_ELEMENTS,
  BPMN_INPUTS,
  BPMN_NODES,
  CONDITION_LIST,
  typeTuppleList,
} from './const';
import {TriggerWhenColumnChanges} from './services/bpmn/elements/tasks/trigger-when-column-changes.task';
import {ReadColumnValue} from './services/bpmn/elements/tasks/read-column.task';
import {SendEmail} from './services/bpmn/elements/tasks/send-email.task';
import {ChangeColumnValue} from './services/bpmn/elements/tasks/change-column-value.task';
import {BpmnBuilderService} from './services/bpmn/builder.service';
import {ChangeColumnValueAction} from './services/statement/actions/changecolumn.action';
import {SendEmailAction} from './services/statement/actions/sendmail.action';
import {OnChangeEvent} from './services/statement/events/onchange.event';
import {OnValueEvent} from './services/statement/events/onvalue.event';
import {ColumnInput} from './services/statement/inputs/column.input';
import {ConditionInput} from './services/statement/inputs/condition.input';
import {
  EmailDataInput,
  EmailRecepientInput,
  EmailToInput,
} from './services/statement/inputs/email.input';
import {ToColumnInput} from './services/statement/inputs/tocolumn.input';
import {ToValueInput} from './services/statement/inputs/tovalue.input';
import {ValueInput} from './services/statement/inputs/value.input';
import {BuilderService, ElementService, NodeService} from './classes';
import {
  CreateBasicStrategy,
  CreateGatewayStrategy,
  CreateTaskStrategy,
  CreatePropertyStrategy,
  CREATE_BASIC_STRATEGY,
  CREATE_GATEWAY_STRATEGY,
  CREATE_PROPERTIES_STRATEGY,
  CREATE_TASK_STRATEGY,
} from './services/bpmn/strategies/create';
import {
  BasicLinkStrategy,
  GatewayLinkStrategy,
  NoLinkStrategy,
  LINK_BASIC_STRATEGY,
  LINK_GATEWAY_STRATEGY,
  LINK_NONE_STRATEGY,
} from './services/bpmn/strategies/link';
import {BuilderComponent} from './builder/builder.component';
import {NodeComponent} from './builder/node/node.component';
import {BpmnNodesService} from './services/bpmn/node.service';
import {ProcessPropertiesElement} from './services/bpmn/elements/process/process-properties.element';
import {FormsModule} from '@angular/forms';
import {AndGroup, OrGroup} from './services/statement/groups';
import {GroupComponent} from './builder/group/group.component';

import {
  NgbDatepickerModule,
  NgbTimepickerModule,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {ENV} from './types';
@NgModule({
  declarations: [BuilderComponent, GroupComponent, NodeComponent],
  exports: [BuilderComponent, GroupComponent, NodeComponent, NgxPopperjsModule],
  imports: [
    CommonModule,
    FormsModule,
    NgxPopperjsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbPopoverModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [
    {
      provide: CustomBpmnModdle,
      useFactory: () => new BPMNModdle({camunda: CAMUNDA}),
    },
    {
      provide: BASE_XML,
      useValue: BASE_XML_VALUE,
    },
    {provide: ElementService, useClass: BpmnElementService},
    {provide: NodeService, useClass: BpmnNodesService},
    {provide: BuilderService, useClass: BpmnBuilderService},
    AutoLayoutService,
    DiFactoryService,
    {provide: BPMN_NODES, useValue: ChangeColumnValueAction, multi: true},
    // {provide: BPMN_NODES, useValue: ReadColumnValueAction, multi: true},
    {provide: BPMN_NODES, useValue: SendEmailAction, multi: true},
    {provide: BPMN_NODES, useValue: OnChangeEvent, multi: true},
    {provide: BPMN_NODES, useValue: OnValueEvent, multi: true},
    {provide: BPMN_NODES, useValue: AndGroup, multi: true},
    {provide: BPMN_NODES, useValue: OrGroup, multi: true},
    {provide: BPMN_ELEMENTS, useValue: StartElement, multi: true},
    {provide: BPMN_ELEMENTS, useValue: EndElement, multi: true},
    {provide: BPMN_ELEMENTS, useValue: GatewayElement, multi: true},
    {provide: BPMN_ELEMENTS, useValue: ProcessElement, multi: true},
    {provide: BPMN_ELEMENTS, useValue: TriggerWhenColumnChanges, multi: true},
    {provide: BPMN_ELEMENTS, useValue: ReadColumnValue, multi: true},
    {provide: BPMN_ELEMENTS, useValue: SendEmail, multi: true},
    {provide: BPMN_ELEMENTS, useValue: ChangeColumnValue, multi: true},
    {provide: BPMN_ELEMENTS, useValue: ProcessPropertiesElement, multi: true},
    {provide: BPMN_INPUTS, useClass: ColumnInput, multi: true},
    {provide: BPMN_INPUTS, useClass: ConditionInput, multi: true},
    {provide: BPMN_INPUTS, useClass: EmailDataInput, multi: true},
    {provide: BPMN_INPUTS, useClass: EmailToInput, multi: true},
    {provide: BPMN_INPUTS, useClass: EmailRecepientInput, multi: true},
    {provide: BPMN_INPUTS, useClass: ToColumnInput, multi: true},
    {provide: BPMN_INPUTS, useClass: ToValueInput, multi: true},
    {provide: BPMN_INPUTS, useClass: ValueInput, multi: true},
    {provide: CREATE_BASIC_STRATEGY, useClass: CreateBasicStrategy},
    {provide: CREATE_GATEWAY_STRATEGY, useClass: CreateGatewayStrategy},
    {provide: CREATE_TASK_STRATEGY, useClass: CreateTaskStrategy},
    {provide: CREATE_PROPERTIES_STRATEGY, useClass: CreatePropertyStrategy},
    {provide: LINK_BASIC_STRATEGY, useClass: BasicLinkStrategy},
    {provide: LINK_GATEWAY_STRATEGY, useClass: GatewayLinkStrategy},
    {provide: LINK_NONE_STRATEGY, useClass: NoLinkStrategy},
    {provide: CONDITION_LIST, useValue: typeTuppleList},
  ],
})
export class WorkflowBuilderModule {
  public static forRoot(environment: ENV): ModuleWithProviders<unknown> {
    return {
      ngModule: WorkflowBuilderModule,
      providers: [
        {
          provide: 'env',
          useValue: environment,
        },
      ],
    };
  }
}

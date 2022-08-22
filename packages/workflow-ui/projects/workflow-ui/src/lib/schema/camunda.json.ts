// sonarignore:start
export const CAMUNDA = {
  name: 'Camunda',
  uri: 'http://camunda.org/schema/1.0/bpmn',
  prefix: 'camunda',
  xml: {
    tagAlias: 'lowerCase',
  },
  associations: [],
  types: [
    {
      name: 'Definitions',
      isAbstract: true,
      extends: ['bpmn:Definitions'],
      properties: [
        {
          name: 'diagramRelationId',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'InOutBinding',
      superClass: ['Element'],
      isAbstract: true,
      properties: [
        {
          name: 'source',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'sourceExpression',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'target',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'businessKey',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'local',
          isAttr: true,
          type: 'Boolean',
          default: false,
        },
        {
          name: 'variables',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'In',
      superClass: ['InOutBinding'],
      meta: {
        allowedIn: ['bpmn:CallActivity', 'bpmn:SignalEventDefinition'],
      },
    },
    {
      name: 'Out',
      superClass: ['InOutBinding'],
      meta: {
        allowedIn: ['bpmn:CallActivity'],
      },
    },
    {
      name: 'AsyncCapable',
      isAbstract: true,
      extends: ['bpmn:Activity', 'bpmn:Gateway', 'bpmn:Event'],
      properties: [
        {
          name: 'async',
          isAttr: true,
          type: 'Boolean',
          default: false,
        },
        {
          name: 'asyncBefore',
          isAttr: true,
          type: 'Boolean',
          default: false,
        },
        {
          name: 'asyncAfter',
          isAttr: true,
          type: 'Boolean',
          default: false,
        },
        {
          name: 'exclusive',
          isAttr: true,
          type: 'Boolean',
          default: true,
        },
      ],
    },
    {
      name: 'JobPriorized',
      isAbstract: true,
      extends: ['bpmn:Process', 'camunda:AsyncCapable'],
      properties: [
        {
          name: 'jobPriority',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'SignalEventDefinitionExtension',
      isAbstract: true,
      extends: ['bpmn:SignalEventDefinition'],
      properties: [
        {
          name: 'async',
          isAttr: true,
          type: 'Boolean',
          default: false,
        },
      ],
    },
    {
      name: 'ErrorEventDefinitionExtension',
      isAbstract: true,
      extends: ['bpmn:ErrorEventDefinition'],
      properties: [
        {
          name: 'errorCodeVariable',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'errorMessageVariable',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'ErrorEventDefinition',
      superClass: ['bpmn:ErrorEventDefinition', 'Element'],
      properties: [
        {
          name: 'expression',
          isAttr: true,
          type: 'String',
        },
      ],
      meta: {
        allowedIn: ['bpmn:ServiceTask'],
      },
    },
    {
      name: 'Error',
      isAbstract: true,
      extends: ['bpmn:Error'],
      properties: [
        {
          name: 'camunda:errorMessage',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'PotentialStarter',
      superClass: ['Element'],
      properties: [
        {
          name: 'resourceAssignmentExpression',
          type: 'bpmn:ResourceAssignmentExpression',
        },
      ],
    },
    {
      name: 'FormSupported',
      isAbstract: true,
      extends: ['bpmn:StartEvent', 'bpmn:UserTask'],
      properties: [
        {
          name: 'formHandlerClass',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'formKey',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'formRef',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'formRefBinding',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'formRefVersion',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'TemplateSupported',
      isAbstract: true,
      extends: ['bpmn:Collaboration', 'bpmn:Process', 'bpmn:FlowElement'],
      properties: [
        {
          name: 'modelerTemplate',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'modelerTemplateVersion',
          isAttr: true,
          type: 'Integer',
        },
      ],
    },
    {
      name: 'Initiator',
      isAbstract: true,
      extends: ['bpmn:StartEvent'],
      properties: [
        {
          name: 'initiator',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'ScriptTask',
      isAbstract: true,
      extends: ['bpmn:ScriptTask'],
      properties: [
        {
          name: 'resultVariable',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'resource',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'Process',
      isAbstract: true,
      extends: ['bpmn:Process'],
      properties: [
        {
          name: 'candidateStarterGroups',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'candidateStarterUsers',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'versionTag',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'historyTimeToLive',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'isStartableInTasklist',
          isAttr: true,
          type: 'Boolean',
          default: true,
        },
      ],
    },
    {
      name: 'EscalationEventDefinitionExtension',
      isAbstract: true,
      extends: ['bpmn:EscalationEventDefinition'],
      properties: [
        {
          name: 'escalationCodeVariable',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'FormalExpression',
      isAbstract: true,
      extends: ['bpmn:FormalExpression'],
      properties: [
        {
          name: 'resource',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'Assignable',
      extends: ['bpmn:UserTask'],
      properties: [
        {
          name: 'assignee',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'candidateUsers',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'candidateGroups',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'dueDate',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'followUpDate',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'priority',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'CallActivity',
      extends: ['bpmn:CallActivity'],
      properties: [
        {
          name: 'calledElementBinding',
          isAttr: true,
          type: 'String',
          default: 'latest',
        },
        {
          name: 'calledElementVersion',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'calledElementVersionTag',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'calledElementTenantId',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'caseRef',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'caseBinding',
          isAttr: true,
          type: 'String',
          default: 'latest',
        },
        {
          name: 'caseVersion',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'caseTenantId',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'variableMappingClass',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'variableMappingDelegateExpression',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'ServiceTaskLike',
      extends: [
        'bpmn:ServiceTask',
        'bpmn:BusinessRuleTask',
        'bpmn:SendTask',
        'bpmn:MessageEventDefinition',
      ],
      properties: [
        {
          name: 'expression',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'class',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'delegateExpression',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'resultVariable',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'DmnCapable',
      extends: ['bpmn:BusinessRuleTask'],
      properties: [
        {
          name: 'decisionRef',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'decisionRefBinding',
          isAttr: true,
          type: 'String',
          default: 'latest',
        },
        {
          name: 'decisionRefVersion',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'mapDecisionResult',
          isAttr: true,
          type: 'String',
          default: 'resultList',
        },
        {
          name: 'decisionRefTenantId',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'ExternalCapable',
      extends: ['camunda:ServiceTaskLike'],
      properties: [
        {
          name: 'type',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'topic',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'TaskPriorized',
      extends: ['bpmn:Process', 'camunda:ExternalCapable'],
      properties: [
        {
          name: 'taskPriority',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'Properties',
      superClass: ['Element'],
      meta: {
        allowedIn: ['*'],
      },
      properties: [
        {
          name: 'values',
          type: 'Property',
          isMany: true,
        },
      ],
    },
    {
      name: 'Property',
      superClass: ['Element'],
      properties: [
        {
          name: 'id',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'name',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'value',
          type: 'String',
          isAttr: true,
        },
      ],
    },
    {
      name: 'Connector',
      superClass: ['Element'],
      meta: {
        allowedIn: ['camunda:ServiceTaskLike'],
      },
      properties: [
        {
          name: 'inputOutput',
          type: 'InputOutput',
        },
        {
          name: 'connectorId',
          type: 'String',
        },
      ],
    },
    {
      name: 'InputOutput',
      superClass: ['Element'],
      meta: {
        allowedIn: ['bpmn:FlowNode', 'camunda:Connector'],
      },
      properties: [
        {
          name: 'inputOutput',
          type: 'InputOutput',
        },
        {
          name: 'connectorId',
          type: 'String',
        },
        {
          name: 'inputParameters',
          isMany: true,
          type: 'InputParameter',
        },
        {
          name: 'outputParameters',
          isMany: true,
          type: 'OutputParameter',
        },
      ],
    },
    {
      name: 'InputOutputParameter',
      properties: [
        {
          name: 'name',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'value',
          isBody: true,
          type: 'String',
        },
        {
          name: 'definition',
          type: 'InputOutputParameterDefinition',
        },
      ],
    },
    {
      name: 'InputOutputParameterDefinition',
      isAbstract: true,
    },
    {
      name: 'List',
      superClass: ['InputOutputParameterDefinition'],
      properties: [
        {
          name: 'items',
          isMany: true,
          type: 'InputOutputParameterDefinition',
        },
      ],
    },
    {
      name: 'Map',
      superClass: ['InputOutputParameterDefinition'],
      properties: [
        {
          name: 'entries',
          isMany: true,
          type: 'Entry',
        },
      ],
    },
    {
      name: 'Entry',
      properties: [
        {
          name: 'key',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'value',
          isBody: true,
          type: 'String',
        },
        {
          name: 'definition',
          type: 'InputOutputParameterDefinition',
        },
      ],
    },
    {
      name: 'Value',
      superClass: ['InputOutputParameterDefinition'],
      properties: [
        {
          name: 'id',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'name',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'value',
          isBody: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'Script',
      superClass: ['InputOutputParameterDefinition'],
      properties: [
        {
          name: 'scriptFormat',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'resource',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'value',
          isBody: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'Field',
      superClass: ['Element'],
      meta: {
        allowedIn: [
          'camunda:ServiceTaskLike',
          'camunda:ExecutionListener',
          'camunda:TaskListener',
        ],
      },
      properties: [
        {
          name: 'name',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'expression',
          type: 'String',
        },
        {
          name: 'stringValue',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'string',
          type: 'String',
        },
      ],
    },
    {
      name: 'InputParameter',
      superClass: ['InputOutputParameter'],
    },
    {
      name: 'OutputParameter',
      superClass: ['InputOutputParameter'],
    },
    {
      name: 'Collectable',
      isAbstract: true,
      extends: ['bpmn:MultiInstanceLoopCharacteristics'],
      superClass: ['camunda:AsyncCapable'],
      properties: [
        {
          name: 'collection',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'elementVariable',
          isAttr: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'FailedJobRetryTimeCycle',
      superClass: ['Element'],
      meta: {
        allowedIn: [
          'camunda:AsyncCapable',
          'bpmn:MultiInstanceLoopCharacteristics',
        ],
      },
      properties: [
        {
          name: 'body',
          isBody: true,
          type: 'String',
        },
      ],
    },
    {
      name: 'ExecutionListener',
      superClass: ['Element'],
      meta: {
        allowedIn: [
          'bpmn:Task',
          'bpmn:ServiceTask',
          'bpmn:UserTask',
          'bpmn:BusinessRuleTask',
          'bpmn:ScriptTask',
          'bpmn:ReceiveTask',
          'bpmn:ManualTask',
          'bpmn:ExclusiveGateway',
          'bpmn:SequenceFlow',
          'bpmn:ParallelGateway',
          'bpmn:InclusiveGateway',
          'bpmn:EventBasedGateway',
          'bpmn:StartEvent',
          'bpmn:IntermediateCatchEvent',
          'bpmn:IntermediateThrowEvent',
          'bpmn:EndEvent',
          'bpmn:BoundaryEvent',
          'bpmn:CallActivity',
          'bpmn:SubProcess',
          'bpmn:Process',
        ],
      },
      properties: [
        {
          name: 'expression',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'class',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'delegateExpression',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'event',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'script',
          type: 'Script',
        },
        {
          name: 'fields',
          type: 'Field',
          isMany: true,
        },
      ],
    },
    {
      name: 'TaskListener',
      superClass: ['Element'],
      meta: {
        allowedIn: ['bpmn:UserTask'],
      },
      properties: [
        {
          name: 'expression',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'class',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'delegateExpression',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'event',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'script',
          type: 'Script',
        },
        {
          name: 'fields',
          type: 'Field',
          isMany: true,
        },
        {
          name: 'id',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'eventDefinitions',
          type: 'bpmn:TimerEventDefinition',
          isMany: true,
        },
      ],
    },
    {
      name: 'FormProperty',
      superClass: ['Element'],
      meta: {
        allowedIn: ['bpmn:StartEvent', 'bpmn:UserTask'],
      },
      properties: [
        {
          name: 'id',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'name',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'type',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'required',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'readable',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'writable',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'variable',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'expression',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'datePattern',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'default',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'values',
          type: 'Value',
          isMany: true,
        },
      ],
    },
    {
      name: 'FormData',
      superClass: ['Element'],
      meta: {
        allowedIn: ['bpmn:StartEvent', 'bpmn:UserTask'],
      },
      properties: [
        {
          name: 'fields',
          type: 'FormField',
          isMany: true,
        },
        {
          name: 'businessKey',
          type: 'String',
          isAttr: true,
        },
      ],
    },
    {
      name: 'FormField',
      superClass: ['Element'],
      properties: [
        {
          name: 'id',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'label',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'type',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'datePattern',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'defaultValue',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'properties',
          type: 'Properties',
        },
        {
          name: 'validation',
          type: 'Validation',
        },
        {
          name: 'values',
          type: 'Value',
          isMany: true,
        },
      ],
    },
    {
      name: 'Validation',
      superClass: ['Element'],
      properties: [
        {
          name: 'constraints',
          type: 'Constraint',
          isMany: true,
        },
      ],
    },
    {
      name: 'Constraint',
      superClass: ['Element'],
      properties: [
        {
          name: 'name',
          type: 'String',
          isAttr: true,
        },
        {
          name: 'config',
          type: 'String',
          isAttr: true,
        },
      ],
    },
    {
      name: 'ConditionalEventDefinitionExtension',
      isAbstract: true,
      extends: ['bpmn:ConditionalEventDefinition'],
      properties: [
        {
          name: 'variableName',
          isAttr: true,
          type: 'String',
        },
        {
          name: 'variableEvents',
          isAttr: true,
          type: 'String',
        },
      ],
    },
  ],
  emumerations: [],
};
// sonarignore:end

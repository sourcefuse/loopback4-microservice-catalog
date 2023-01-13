export enum ElementTypes {
  ServiceTask = 'service.task',
  Start = 'start.event',
  End = 'end.event',
  Process = 'process',
  Gateway = 'gateway',
  EGateway = 'egateway',
  Extension = 'extension',
}

export enum InputTypes {
  List = 'list',
  Text = 'text',
  Number = 'number',
  Boolean = 'boolean',
  Percentage = 'percentage',
  People = 'people',
  Interval = 'interval',
  Date = 'date',
  DateTime = 'datetime',
  Email = 'Email',
}

export enum ConditionTypes {
  Equal = 'equal',
  NotEqual = 'notequal',
  PastToday = 'pasttoday',
  DueInDays = 'dueindays',
  ComingIn = 'comingin',
  PastBy = 'pastby',
  GreaterThan = 'greaterThan',
  LessThan = 'lessThan',
  Like = 'like',
  Changes = 'changes',
}

export enum NodeTypes {
  ACTION,
  EVENT,
  GROUP,
}

export enum ElementNames {
  readColumnValue = 'read column value',
  gateway = 'gateway',
}

export enum NUMBER {
  TWO = 2,
  THREE = 3,
  NINE = 9,
}

export enum NotificationRecipientTypesEnum {
  NotifyMe = 'me',
  NotifyEveryoneOnProject = 'everyone_on_project',
  NotifyProjectOwners = 'project_owners',
  NotifySpecificPeople = 'specific_people',
}

export enum EventTypes {
  OnChangeEvent = 'OnChangeEvent',
  OnValueEvent = 'OnValueEvent',
  OnIntervalEvent = 'OnIntervalEvent',
  OnAddItemEvent = 'OnAddItemEvent',
}

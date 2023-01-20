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
  Boolean = 'boolean',
  Date = 'date',
  DateTime = 'datetime',
  Email = 'Email',
  Interval = 'interval',
  List = 'list',
  Number = 'number',
  People = 'people',
  Percentage = 'percentage',
  Text = 'text',
}

export enum ConditionTypes {
  Changes = 'changes',
  ComingIn = 'comingin',
  DueInDays = 'dueindays',
  Equal = 'equal',
  GreaterThan = 'greaterThan',
  LessThan = 'lessThan',
  Like = 'like',
  NotEqual = 'notequal',
  PastBy = 'pastby',
  PastToday = 'pasttoday',
}

export enum NodeTypes {
  ACTION,
  EVENT,
  GROUP,
}

export enum ElementNames {
  gateway = 'gateway',
  readColumnValue = 'read column value',
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
  OnAddItemEvent = 'OnAddItemEvent',
  OnChangeEvent = 'OnChangeEvent',
  OnIntervalEvent = 'OnIntervalEvent',
  OnValueEvent = 'OnValueEvent',
}

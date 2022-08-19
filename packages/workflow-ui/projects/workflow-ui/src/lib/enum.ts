export enum ElementTypes {
  ServiceTask = 'service.task',
  Start = 'start.event',
  End = 'end.event',
  Process = 'process',
  Gateway = 'gateway',
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
}


export enum NodeTypes {
  ACTION,
  EVENT,
  GROUP
}

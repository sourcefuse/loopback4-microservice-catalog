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
  DateTime = 'datetime',
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
  GROUP,
}

export enum ElementTypes {
  readColumnValue = 'read column value',
  gateway = 'gateway',
}

export enum NUMBER {
  TWO = 2,
  NINE = 9,
}

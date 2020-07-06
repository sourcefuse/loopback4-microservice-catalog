export const enum ErrorKeys {
  //not exist
  CalendarNotExist = 'Calendar Not Exist',
  PrimaryCalendarNotExist = 'Primary Calendar Not Exist',
  EventNotExist = 'Event Not Exist',
  SubscriptionNotExist = 'Subscription Not exist',
  SubscriptionIdentifierNotExist = 'Subscription Identifier Not exist',
  IdNotExist = 'Id Not Exist',

  //unprocessable
  DateInvalid = 'Date Invalid',
  ItemInvalid = 'Item Array Invalid',

  //general
  CanNotBeGreater = 'Start Date Can Not Greater Then End Date',

  IdNotMatchedWithParameters = 'Id in Request Body not matching with Query Parameters',

  DuplicateDayOfWeek = 'Duplicate DayOfWeek',
}

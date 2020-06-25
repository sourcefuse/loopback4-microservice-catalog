export const enum ErrorKeys {
  //not exist
  CalendarNotExist = 'Calendar Not Exist',
  PrimaryCalendarNotExist = 'Primary Calendar Not Exist',
  EventNotExist = 'Event Not Exist',
  SubscriptionNotExist = 'Subscription Not exist',

  //unprocessable
  DateInvalid = 'Date Invalid',

  //general
  CanNotBeGreater = 'Start Date Can Not Greater Then End Date',

  IdNotMatchedWithParameters = 'Id in Request Body not matching with Query Parameters',

  DuplicateDayOfWeek = 'Duplicate DayOfWeek',
}

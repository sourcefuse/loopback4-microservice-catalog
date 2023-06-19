export enum QuestionStatus {
  DRAFT = 'Draft',
  APPROVED = 'Approved',
  ADDED_TO_SURVEY = 'Added to survey',
  ARCHIVE = 'Archive',
}
export enum QuestionType {
  MULTI_SELECTION = 'Multi Selection',
  SCALE = 'Scale',
  SINGLE_SELECTION = 'Single Selection',
  TEXT = 'Text',
  DROPDOWN = 'Drop Down',
}

export enum SurveyRecurrenceFrequency {
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Biannually = 'Biannually',
  Annually = 'Annually',
}
export enum SurveyStatus {
  DRAFT = 'Draft',
  APPROVED = 'Approved',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  Expired = 'Expired',
}
export enum REGEX {
  EMAIL = "[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+",
  NO_WHITE_SPACE = '^(?=\\s*\\S).+$',
  TWO_DECIMAL_PLACE = '^-?\\d*(\\.\\d{0,2})?$',
}

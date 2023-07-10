export const ErrorKeys = {
  NotAuthorised: 'Action prohibited.',
  QuestionTemplateStatusNotInDraftOrApproved:
    'QuestionTemplate Status Not In Draft Or Approved',
  MaxOptionsInQuestionReached: 'Max Options InQuestion Reached',
  DuplicateTemplateQuestionEntry:
    'This question has already been used in this template',
  InvalidStatus: 'Invalid Status',
  InvalidName: 'Invalid value entered in name',
  DecimalValueNotSupported: 'Decimal Value not Supported',
  AddApprovedQuestionTemplateId: 'Please send approved question template id',

  RemoveExtraParams: 'Remove extra params from the request body',
  RequiredSurveyParamsMissing: 'Survey Id or display order missing in request',
  EndDateCanNotBeLess: 'End date can not be less than start date',
  PastDateNotAllowed:
    'User can create survey in current date or greater than current date',
  MaxSurveyTextLength: 'Introduction must NOT have more then 2500 characters',
  DuplicateSurveyQuestionEntry:
    'This question has already been used in this survey',
  DisplayOrderMissing: 'Display Order is missing in the request',
  SurveyIdDoesNotMatch: 'Survey Id in path and body does not match',
  DeleteNotAllowedForSurveyOrTemplateUsedEntity: `Question cannot be deleted as it is already used in a survey or template.`,
  SurveyResponseDetailNotFound: 'Survey Response Detail Not Found',
  SurveyStartDateShouldBeCurrentDate:
    'Survey start date should be current date only and status should be active',
  SurveyCannotBeActivated: 'Survey can not be activated without a start date',
  SurveyCannotBeActivatedInDraftState:
    'Survey Cannot Be Activated In A Draft State',
  EndDateCannotBeInPast: 'End Date Cannot Be In Past',
};

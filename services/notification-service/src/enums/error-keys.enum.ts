// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export const enum ErrorKeys {
  ReceiverNotFound = 'ReceiverNotFound',
  BodyNotFound = 'Body Not Found',
  GroupKeyMandatory = 'For draft notification group key is mandatory.',
  GroupedDraftError = 'For drafting notification with group key subject, receiver and fromEmail in options does not need to be in request.',
  GroupedDraftSubjectError = 'For drafting notification with group key subject should not be in the request.',
  GroupedDraftReceiverError = 'For drafting notification with group key receiver should not be in the request.',
  GroupedDraftFromEmailError = 'For drafting notification with group key fromEmail should not be in the options key of request.',
  DraftError = 'For drafting notification with out group key, subject, receiver and fromEmail in options are mandatory.',
  MandatoryGroupKey = 'Group key is mandatory.',
  NoDraftFound = 'There is no draft notification found to send.',
  StartEndTimeBothMandatoryTogether = 'In case start time is given end time is mandatory and vice-versa.',
  NoUserFoundToSendNotification = 'No user is found with given criteria to send notifications.',
}

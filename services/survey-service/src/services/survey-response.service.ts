import {
  injectable,
  /* inject, */
  BindingScope,
} from '@loopback/core';
import {ResponderReminderDto} from '../models/responder-reminder-dto.model';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyResponseService {
  constructor() {}

  async sendResponderReminderEmail(
    surveyId: string,
    responderReminderDto: ResponderReminderDto,
  ) {
    // Need to provide handler for this
  }
}

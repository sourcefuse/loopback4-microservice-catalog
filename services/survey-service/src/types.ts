// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IServiceConfig} from '@sourceloop/core';

// sonarignore:start
export interface ISurveyServiceConfig extends IServiceConfig {
  //do nothing
}

export interface SendReminderFunction {
  sendReminder(surveyId: string, reuiredData: any): Promise<object>;
}

export const SurveyDbSourceName = 'SurveyDb';

// sonarignore:end

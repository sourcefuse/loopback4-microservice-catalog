// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Props} from './props';
import {Status} from './status';
import {TourStep} from './tour-step';
export interface TourState {
  sessionId: string;
  status: Status;
  step: string;
  route?: string;
  props?: Props;
}

export interface Tour {
  tourId: string;
  tourSteps: TourStep[];
  styleSheet: string;
}

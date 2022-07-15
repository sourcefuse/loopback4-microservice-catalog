// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {TourState} from './tour';

export interface SaveStateParameters {
  tourId: string;
  state: TourState;
}

export interface LoadStateParameters {
  tourId: string;
  sessionId: string;
}

export interface DeleteStateParameters {
  tourId: string;
  sessionId: string;
}

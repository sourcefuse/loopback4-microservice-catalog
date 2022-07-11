// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import Step from 'shepherd.js/src/types/step';

export interface TourButton {
  action?: () => Step.StepOptionsButton['action'];
  classes?: string;
  text: string;
  key?: string;
  secondary?: boolean;
}

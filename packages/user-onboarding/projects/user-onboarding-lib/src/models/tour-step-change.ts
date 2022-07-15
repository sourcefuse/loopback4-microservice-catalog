// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export type TourStepChange = {
  tourId: string;
  currentStepId: string;
  previousStepId: string;
  moveForward: boolean;
};

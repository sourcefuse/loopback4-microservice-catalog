import {TourStep} from './tour-step';

export interface SaveTourParameters {
  tourId: string;
  tourSteps: TourStep[];
  styleSheet: string;
}

export interface LoadTourParameters {
  sessionId: string;
  tourId: string;
}

export interface DeleteTourParameters {
  sessionId: string;
  tourId: string;
}

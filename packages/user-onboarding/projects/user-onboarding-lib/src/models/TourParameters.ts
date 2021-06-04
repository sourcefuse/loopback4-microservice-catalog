import { TourStep } from './TourStep';

export interface SaveTourParameters {
  tourId: string;
  tourSteps: TourStep[];
  styleSheet: string;
}

export interface LoadTourParameters {
  tourId: string;
}

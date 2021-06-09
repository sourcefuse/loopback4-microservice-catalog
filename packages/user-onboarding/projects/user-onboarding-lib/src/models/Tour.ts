import { TourStep } from './TourStep';
export interface TourState {
  sessionId: string;
  step: string;
  route?: string;
}

export interface Tour {
  tourId: string;
  tourSteps: TourStep[];
  styleSheet: string;
}

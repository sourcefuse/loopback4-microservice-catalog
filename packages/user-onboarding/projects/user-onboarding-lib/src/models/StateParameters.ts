import {TourState} from './Tour';

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

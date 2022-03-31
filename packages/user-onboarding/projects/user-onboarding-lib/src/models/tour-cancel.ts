import Shepherd from 'shepherd.js';

export type TourCancel = {
  index: number;
  tour: Shepherd.Tour;
  tourId: string;
};

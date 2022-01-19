import {TourStep} from './tour-step';

export type FilterFunction = (steps: TourStep[]) => TourStep[];

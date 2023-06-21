import {
  DeleteStateCommand,
  DeleteTourCommand,
  LoadStateCommand,
  LoadTourCommand,
  SaveStateCommand,
  SaveTourCommand,
} from '../commands';
import {
  DeleteStateParameters,
  DeleteTourParameters,
  LoadStateParameters,
  SaveStateParameters,
  Status,
  Tour,
  TourState,
  TourStep,
} from '../models';
import {tourSteps} from './tourService.mock';
export const newTour: Tour = {
  tourId: '1',
  tourSteps: tourSteps,
  styleSheet: '',
};
export const parameterST = {
  tourId: '1',
  tourSteps: [],
  styleSheet: '',
};
export const commandST: SaveTourCommand = {
  parameters: newTour,
  execute: jasmine.createSpy('execute').and.returnValues(newTour),
};
export const parameterLT = {
  sessionId: '1',
  tourId: '1',
};
export const commandLT: LoadTourCommand = {
  parameters: parameterLT,
  execute: jasmine.createSpy('execute').and.returnValues(newTour),
};
export const tourstate: TourState = {
  sessionId: '1',
  status: Status.Complete,
  step: '1',
};
export const parameterSS: SaveStateParameters = {
  tourId: '1',
  state: tourstate,
};
export const newTourState = parameterSS.state;
export const commandSS: SaveStateCommand = {
  parameters: parameterSS,
  execute: jasmine.createSpy('execute').and.returnValues(newTourState),
};
export const parameterLS: LoadStateParameters = {
  tourId: '1',
  sessionId: '1',
};
export const commandLS: LoadStateCommand = {
  parameters: parameterLS,
  execute: jasmine.createSpy('execute'),
};
export const parameterDS: DeleteStateParameters = {
  tourId: '1',
  sessionId: '1',
};
export const commandDS: DeleteStateCommand = {
  parameters: parameterDS,
  execute() {
    // This is intentional
  },
};
export const parameterDT: DeleteTourParameters = {
  sessionId: '1',
  tourId: '1',
};
export const commandDT: DeleteTourCommand = {
  parameters: parameterDT,
  execute() {
    // This is intentional
  },
};
export function argFunction() {
  // This is intentional
}
export function argFn() {
  return 'stringValue';
}
export function filterFn(tourStep: TourStep[]) {
  return tourStep;
}
export const sessionId = '701ce712-375d-4afc-8ddb-3dbb5afde5b4';

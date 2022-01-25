import Step from 'shepherd.js/src/types/step';

export interface TourButton {
  action?: () => Step.StepOptionsButton['action'];
  classes?: string;
  text: string;
  key?: string;
  secondary?: boolean;
}

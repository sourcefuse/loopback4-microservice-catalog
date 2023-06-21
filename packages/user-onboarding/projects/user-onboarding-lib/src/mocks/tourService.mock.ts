import {TourStep} from '../models';
export const tourSteps: TourStep[] = [
  {
    id: '1',
    prevStepId: '1',
    nextStepId: '2',
    text: `
      <div class="tour-step">Step 1 of 3</div>
      <div class="tour-title">Step 1</div>
      <div class="tour-description">
      Sample Example for tour steps
      </div>`,
    buttons: [
      {
        text: 'Skip',
        key: 'skipAction',
        classes: 'shepherd-button-skip',
      },
      {
        text: 'Next',
        key: 'nextAction',
        classes: 'shepherd-button-next',
      },
    ],
    currentRoute: '/',
    nextRoute: '/',
    prevRoute: '/',
    cancelIcon: {
      enabled: false,
    },
  },
];

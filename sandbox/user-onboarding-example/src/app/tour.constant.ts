// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {prefix, suffix, TourStep} from '@sourceloop/user-onboarding-client';

const NEXT_BUTTON_CLASS = 'shepherd-button-next';
const SKIP_BUTTON_CLASS = 'shepherd-button-skip';

export const BUTTONS_FIRST_STEP = [
  {
    text: 'Skip',
    key: 'skipAction',
    classes: SKIP_BUTTON_CLASS,
  },
  {
    text: 'Next',
    key: 'nextAction',
    classes: NEXT_BUTTON_CLASS,
  },
];
export const BUTTONS_INTERMEDIATE_STEP = [
  {
    text: 'Previous',
    key: 'prevAction',
    classes: 'shepherd-button-prev',
  },
  {
    text: 'Skip',
    key: 'skipAction',
    classes: SKIP_BUTTON_CLASS,
  },
  {
    text: 'Next',
    key: 'nextAction',
    classes: NEXT_BUTTON_CLASS,
  },
];
export const BUTTONS_LAST_STEP = [
  {
    text: 'Previous',
    key: 'prevAction',
    classes: 'shepherd-button-prev shepherd-button-prev-no-skip',
  },
  {
    text: 'Done',
    key: 'nextAction',
    classes: NEXT_BUTTON_CLASS,
  },
];

const POPPER_OFFSET_SKIDDING = 0;
const POPPER_OFFSET_DISTANCE = 4;
export const POPPER_OPTIONS = {
  modifiers: [
    {
      name: 'offset',
      options: {offset: [POPPER_OFFSET_SKIDDING, POPPER_OFFSET_DISTANCE]},
    },
  ],
};

export const CANCEL_ICON = {
  enabled: false,
};

export const MODAL_OVERLAY_OPENING_RADIUS = 4;

export const enum TourId {
  DashboardTour = 'sourceloop-example-dashboard-tour',
  DevTour = 'sourceloop-example-dev-tour',
}

const enum DashboardTourSteps {
  Step1 = 'dashboard-step1',
  Step2 = 'dashboard-step2',
  Step3 = 'dashboard-step3',
  Step4 = 'dashboard-step4',
  Step5 = 'dashboard-step5',
}
const enum DevsTourSteps {
  Step1 = 'dev-step1',
  Step2 = 'dev-step2',
  Step3 = 'dev-step3',
}

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    title: '',
    id: DashboardTourSteps.Step1,
    prevStepId: DashboardTourSteps.Step1,
    nextStepId: DashboardTourSteps.Step2,
    text: `
      <div class="tour-step">Step 1 of 5</div>
      <div class="tour-title">Step 1</div>
      <div class="tour-description">
      Sample Example for tour steps
      </div>`,
    buttons: BUTTONS_FIRST_STEP,
    attachTo: {
      element: '.dashboard-tour-step1',
      on: 'bottom',
      type: 'string',
      scrollTo: true,
    },
    currentRoute: '/',
    nextRoute: '/',
    prevRoute: '/',
    cancelIcon: CANCEL_ICON,
    modalOverlayOpeningRadius: MODAL_OVERLAY_OPENING_RADIUS,
    arrow: false,
    popperOptions: POPPER_OPTIONS,
  },
  {
    title: '',
    id: DashboardTourSteps.Step2,
    prevStepId: DashboardTourSteps.Step1,
    nextStepId: DashboardTourSteps.Step3,
    text: `
      <div class="tour-step">Step 2 of 5</div>
      <div class="tour-title">Step 2</div>
      <div class="tour-description">
      Sample Example for tour steps
      </div>`,
    buttons: BUTTONS_INTERMEDIATE_STEP,
    attachTo: {
      element: '.dashboard-tour-step2',
      on: 'bottom',
      type: 'string',
      scrollTo: true,
    },
    currentRoute: '/',
    nextRoute: '/',
    prevRoute: '/',
    cancelIcon: CANCEL_ICON,
    modalOverlayOpeningRadius: MODAL_OVERLAY_OPENING_RADIUS,
    arrow: false,
    popperOptions: POPPER_OPTIONS,
  },

  {
    title: '',
    id: DashboardTourSteps.Step3,
    prevStepId: DashboardTourSteps.Step2,
    nextStepId: DashboardTourSteps.Step4,
    text: `
        <div class="tour-step">Step 3 of 5</div>
        <div class="tour-title">Step 3</div>
        <div class="tour-description">
        Sample Example for tour steps
        </div>`,
    buttons: BUTTONS_INTERMEDIATE_STEP,
    attachTo: {
      element: '.dashboard-tour-step3',
      on: 'bottom',
      type: 'string',
      scrollTo: true,
    },
    currentRoute: '/',
    nextRoute: '/',
    prevRoute: '/',
    cancelIcon: CANCEL_ICON,
    modalOverlayOpeningRadius: MODAL_OVERLAY_OPENING_RADIUS,
    arrow: false,
    popperOptions: POPPER_OPTIONS,
  },
  {
    title: '',
    id: DashboardTourSteps.Step4,
    prevStepId: DashboardTourSteps.Step3,
    nextStepId: DashboardTourSteps.Step5,
    text: `
        <div class="tour-step">Step 4 of 5</div>
        <div class="tour-title">Step 4</div>
        <div class="tour-description">
        Sample Example for tour steps
        </div>`,
    buttons: BUTTONS_INTERMEDIATE_STEP,
    attachTo: {
      element: '.dashboard-tour-step4',
      on: 'top',
      type: 'string',
      scrollTo: true,
    },
    currentRoute: '/',
    nextRoute: '/',
    prevRoute: '/',
    cancelIcon: CANCEL_ICON,
    modalOverlayOpeningRadius: MODAL_OVERLAY_OPENING_RADIUS,
    arrow: false,
    popperOptions: POPPER_OPTIONS,
  },
  {
    title: '',
    id: DashboardTourSteps.Step5,
    prevStepId: DashboardTourSteps.Step4,
    nextStepId: '',
    text: `
        <img class="tour-images" src="assets/sample-image.jpg" alt="no image">
        <div class="tour-step">Step 5 of 5</div>
        <div class="tour-title">Step 5</div>
        <div class="tour-description">
        Sample Example for tour steps
        </div>`,
    buttons: BUTTONS_LAST_STEP,
    attachTo: {
      element: '.dashboard-tour-step5',
      on: 'right',
      type: 'string',
      scrollTo: true,
    },
    currentRoute: '/',
    nextRoute: '/',
    prevRoute: '/',
    cancelIcon: CANCEL_ICON,
    modalOverlayOpeningRadius: MODAL_OVERLAY_OPENING_RADIUS,
    arrow: false,
    popperOptions: POPPER_OPTIONS,
  },
];

export const DEVS_TOUR_STEPS: TourStep[] = [
  {
    title: '',
    id: DevsTourSteps.Step1,
    prevStepId: DevsTourSteps.Step1,
    nextStepId: DevsTourSteps.Step2,
    text: `
      <div class="tour-step">Step 1 of 3</div>
      <div class="tour-title">Step 1</div>
      <div class="tour-description">
      Sample Example for tour steps
      </div>`,
    buttons: BUTTONS_FIRST_STEP,
    attachTo: {
      element: '.dev-tour-step1',
      on: 'bottom',
      type: 'string',
      scrollTo: true,
    },
    currentRoute: '/',
    nextRoute: '/',
    prevRoute: '/',
    cancelIcon: CANCEL_ICON,
    modalOverlayOpeningRadius: MODAL_OVERLAY_OPENING_RADIUS,
    arrow: false,
    popperOptions: POPPER_OPTIONS,
  },
  {
    title: '',
    id: DevsTourSteps.Step2,
    prevStepId: DevsTourSteps.Step1,
    nextStepId: DevsTourSteps.Step3,
    text: `
      ${prefix}assets/sample-video.mp4${suffix}
      <div class="tour-step">Step 2 of 3</div>
      <div class="tour-title">Step 2</div>
      <div class="tour-description">
      Sample Example for tour steps
      </div>`,
    buttons: BUTTONS_INTERMEDIATE_STEP,
    attachTo: {
      element: '.dev-tour-step2',
      on: 'right',
      type: 'string',
      scrollTo: true,
    },
    currentRoute: '/',
    nextRoute: '/',
    prevRoute: '/',
    cancelIcon: CANCEL_ICON,
    modalOverlayOpeningRadius: MODAL_OVERLAY_OPENING_RADIUS,
    arrow: false,
    popperOptions: POPPER_OPTIONS,
  },

  {
    title: '',
    id: DevsTourSteps.Step3,
    prevStepId: DevsTourSteps.Step2,
    nextStepId: '',
    text: `
        <div class="tour-step">Step 3 of 3</div>
        <div class="tour-title">Step 3</div>
        <div class="tour-description">
        Sample Example for tour steps
        </div>`,
    buttons: BUTTONS_LAST_STEP,
    attachTo: {
      element: '.dev-tour-step3',
      on: 'right',
      type: 'string',
      scrollTo: true,
    },
    currentRoute: '/',
    nextRoute: '/',
    prevRoute: '/',
    cancelIcon: CANCEL_ICON,
    modalOverlayOpeningRadius: MODAL_OVERLAY_OPENING_RADIUS,
    arrow: false,
    popperOptions: POPPER_OPTIONS,
  },
];

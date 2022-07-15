// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {TourButton} from './tour-button';
import {Type} from '@angular/core';
export interface TourStep {
  id: string;
  nextStepId: string;
  prevStepId: string;
  title?: string;
  text: string | {component: string} | (() => string);
  arrow?: boolean;
  attachTo?: {
    element: string | Element;
    on: string;
    type: 'string' | 'function' | 'element';
    scrollTo: boolean;
  };
  classes?: string;
  advanceOn?: {
    element: string | Element;
    event: string;
    elementType: 'string' | 'function' | 'element';
  };
  buttons?: TourButton[];
  currentRoute?: string;
  nextRoute?: string;
  prevRoute?: string;
  cancelIcon?: {
    enabled?: boolean;
    label?: string;
  };
  modalOverlayOpeningRadius?: number;
  modalOverlayOpeningPadding?: number;
  popperOptions?: object;
}

export type ComponentStep = {
  forStep: string;
  component: Type<unknown>;
};

export type HTMLStep = {
  forStep: string;
  html: () => string;
};

import {TourButton} from './tour-button';

export interface TourStep {
  id: string;
  nextStepId: string;
  prevStepId: string;
  title?: string;
  text: string;
  arrow?: boolean;
  attachTo: {
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

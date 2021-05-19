 import { TourButton } from "./TourButton";

 export interface TourStep {
    id: string;
    title?: string;
    text: string;
    arrow?: boolean;
    attachTo: {
         element: string;
         on: string;
         type: 'string' | 'function' | 'element';
    },
    classes?: string;
     advanceOn?: {
         element: string;
         event: string;
         elementType: 'string' | 'function' | 'element';
    }
    when?: Object;
    buttons?:TourButton[];
}

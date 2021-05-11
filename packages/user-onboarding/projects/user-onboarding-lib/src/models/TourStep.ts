 import { TourButton } from "./TourButton"
 
 export interface TourStep {
    id: number;
    title: string;
    text: string;
    arrow: boolean;
    attachTo: {
         element: string;
         on: string;
         type: 'string' | 'function' | 'element';
    },
     advanceOn: {
         element: string;
         event: string;
         elementType: 'string' | 'function' | 'element';
    }
    when: Object;
  
    buttons:TourButton[]
}

import { TourStep } from "./TourStep"; 
export interface TourState {
    sessionId: string;
    step: number;  
    route: string;
}

 export interface Tour {
    tourId: string;
    tourSteps: TourStep[];
    styleSheet: string; 
}

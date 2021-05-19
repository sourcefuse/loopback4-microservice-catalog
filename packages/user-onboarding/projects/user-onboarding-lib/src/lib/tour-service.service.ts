import { TourStoreServiceService } from './tour-store-service.service';
import { Injectable } from '@angular/core';
import Shepherd from 'shepherd.js';
import { Tour } from '../models';

@Injectable({
  providedIn: 'root'
})

export class TourServiceService {
  currentStep; 
  constructor(private tourStoreService: TourStoreServiceService) {}

  private triggerTour(tourInstance: Tour){
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true
        },
        classes: 'class-1 class-2',
        scrollTo: { behavior: 'smooth', block: 'center' }
      }
    });

    const sessionId = this.tourStoreService.getSessionId(); 
    this.tourStoreService.loadState({tourId: tourInstance.tourId,sessionId}).subscribe((currentStep)=>{
      if(currentStep)
      {
      //state exists
        let flag = true;
        tourInstance.tourSteps = tourInstance.tourSteps.filter((e)=>{
          if(e.id === currentStep.step || !flag)
          {
            flag = false;
          }
          return flag;
        })
      }
      else{
        this.tourStoreService.generateSessionId();
      }
      tourInstance.tourSteps.forEach((e)=>{
          e.buttons.forEach((b)=>{
              const key = b.action;
              b.action = this.tourStoreService.getFnByKey(key);
          })  
      })
      tour.addSteps(tourInstance.tourSteps);
      tour.start();
    })
  }

  public run(tourId: string)
  {
    this.tourStoreService.loadTour({tourId}).subscribe((tourInstance)=>{
      if(tourInstance)
      {
          this.triggerTour(tourInstance);
      }
      else
      { 
          throw new Error("Tour does not exist");
      }
    })
  }
}

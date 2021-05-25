import { TourStoreServiceService } from './tour-store-service.service';
import { Injectable } from '@angular/core';
import Shepherd from 'shepherd.js';
import { Tour } from '../models';

@Injectable({
  providedIn: 'root'
})

export class TourServiceService {
  currentStep;
  constructor(private readonly tourStoreService: TourStoreServiceService) {}

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
    this.tourStoreService.loadState({tourId: tourInstance.tourId,sessionId}).subscribe(currentStep =>{
      if(currentStep)
      {
      //state exists
        let flag = false;
        tourInstance.tourSteps = tourInstance.tourSteps.filter(e =>{
          if(e.id === currentStep.step || flag)
          {
            flag = true;
          }
          return flag;
        });
      }
      else{
        this.tourStoreService.generateSessionId();
      }
      tourInstance.tourSteps.forEach(e =>{
          e.buttons.forEach(b =>{
              const key = b.action;
              b.action = this.tourStoreService.getFnByKey(key);
          });
      });
      tour.addSteps(tourInstance.tourSteps);
      console.log("the tour is working");
      tour.start();
      tour.on("show",()=>{
        this.tourStoreService.saveState({tourId: tourInstance.tourId,state:{sessionId: this.tourStoreService.getSessionId(),step: tour.getCurrentStep().id}})
      })
    });
  }

  public run(tourId: string)
  {
    this.tourStoreService.loadTour({tourId}).subscribe( tourInstance =>{
      if(tourInstance)
      {
          this.triggerTour(tourInstance);
      }
      else
      {
          throw new Error("Tour does not exist");
      }
    });
  }
}

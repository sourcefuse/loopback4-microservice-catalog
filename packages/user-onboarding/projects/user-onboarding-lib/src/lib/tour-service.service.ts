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
    var removedSteps;
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
        let f = true;
        removedSteps = tourInstance.tourSteps.filter(e =>{
          if(e.id === currentStep.step || !f)
          {
            f = false;
          }
          return f;
        });
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
      tour.start();
      if(removedSteps!==undefined)
      {
        removedSteps.forEach(e =>{
          e.buttons.forEach(b =>{
              const k = b.action;
              b.action = this.tourStoreService.getFnByKey(k);
          });
        });
        tour.addSteps(removedSteps);
        for(const step of removedSteps)
        {
            tour.steps.splice(0,0,tour.steps.pop());
        }
      }
      tour.on("show",()=>{
        this.tourStoreService.saveState({tourId: tourInstance.tourId,state:{sessionId: this.tourStoreService.getSessionId(),step: tour.getCurrentStep().id}});
      });
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

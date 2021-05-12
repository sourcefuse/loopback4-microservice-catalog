import { TourStep } from './../models/TourStep';
import { TourStoreServiceService } from './tour-store-service.service';
import { Injectable } from '@angular/core';
import Shepherd from 'shepherd.js';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {steps} from '../assets/steps';

@Injectable({
  providedIn: 'root'
})

export class TourServiceService {
  steps = steps;
  constructor(private storage: StorageService, private TourStoreServiceService: TourStoreServiceService,private TourStep: TourStep) { }
  public run()
  {
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true
        },
        classes: 'class-1 class-2',
        scrollTo: { behavior: 'smooth', block: 'center' }
      }
    });
    tour.addSteps(this.steps);
    if(!this.storage.get(key))
    {
      //state exists
      var currId = tour.getCurrentStep().id;
      while(this.TourStep.id.toString() !== currId)
      {
        tour.removeStep(this.TourStep.id.toString());
      }
     
    }
    

    
    for(var id : number = 0 ; id< this.TourStep.buttons.length ; id++)
    {
      var key = this.TourStep.buttons[id].action;
      var func = this.TourStoreServiceService.getFnByKey(key);
      this.TourStep.buttons[id].action = func;
    }
    tour.start();

  }
}

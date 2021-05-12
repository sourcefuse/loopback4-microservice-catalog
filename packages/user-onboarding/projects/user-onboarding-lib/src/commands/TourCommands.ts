import { Observable,  of } from "rxjs";
import { Inject } from '@angular/core';
import { LoadTourParameters,  SaveTourParameters, Tour } from "../models";
import { LoadTourCommand, SaveTourCommand } from "./types";
import { LOCAL_STORAGE, StorageService } from "ngx-webstorage-service";

export class SaveTCommand implements SaveTourCommand{
  constructor(@Inject(LOCAL_STORAGE) private readonly storage: StorageService) { }
    public parameters: SaveTourParameters;
    execute(): Observable<Tour> {
            const newTour: Tour = {
                tourId : this.parameters.tourId,
                tourSteps: this.parameters.tourSteps,
                styleSheet: this.parameters.styleSheet
            };
        this.storage.set(this.parameters.tourId,newTour);
        return of(newTour)
      };
}

export class LoadTCommand implements LoadTourCommand{
  constructor(private readonly storage: StorageService) { }
    public parameters: LoadTourParameters;
    execute(): Observable<Tour> {
        const existingTour = this.storage.get(this.parameters.tourId);
        return of(existingTour);
      }
}

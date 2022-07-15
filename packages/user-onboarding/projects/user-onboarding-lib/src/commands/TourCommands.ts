// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Observable, of} from 'rxjs';
import {
  DeleteTourParameters,
  LoadTourParameters,
  SaveTourParameters,
  Tour,
} from '../models';
import {DeleteTourCommand, LoadTourCommand, SaveTourCommand} from './types';
import {StorageService} from 'ngx-webstorage-service';

export class SaveTCommand implements SaveTourCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters: SaveTourParameters;
  execute(): Observable<Tour> {
    const newTour: Tour = {
      tourId: this.parameters.tourId,
      tourSteps: this.parameters.tourSteps,
      styleSheet: this.parameters.styleSheet,
    };
    this.storage.set(this.parameters.tourId, newTour);
    return of(newTour);
  }
}

export class LoadTCommand implements LoadTourCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters: LoadTourParameters;
  execute(): Observable<Tour> {
    const existingTour = this.storage.get(this.parameters.tourId);
    return of(existingTour);
  }
}

export class DeleteTCommand implements DeleteTourCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters: DeleteTourParameters;
  execute(): void {
    this.storage.remove(this.parameters.tourId);
  }
}

﻿// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Observable, of} from 'rxjs';
import {
  DeleteStateParameters,
  LoadStateParameters,
  SaveStateParameters,
  TourState,
} from '../models';
import {DeleteStateCommand, LoadStateCommand, SaveStateCommand} from './types';
import {StorageService} from 'ngx-webstorage-service';

export class SaveSCommand implements SaveStateCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters: SaveStateParameters;
  execute(): Observable<TourState> {
    const newTourState = this.parameters.state;
    this.storage.set(
      `${newTourState.sessionId}_${this.parameters.tourId}`,
      newTourState,
    );
    return of(newTourState);
  }
}

export class LoadSCommand implements LoadStateCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters: LoadStateParameters;
  execute(): Observable<TourState> {
    const currentState = this.storage.get(
      `${this.parameters.sessionId}_${this.parameters.tourId}`,
    );
    return of(currentState);
  }
}

export class DeleteSCommand implements DeleteStateCommand {
  constructor(private readonly storage: StorageService) {}
  public parameters: DeleteStateParameters;
  execute() {
    this.storage.remove(
      `${this.parameters.sessionId}_${this.parameters.tourId}`,
    );
  }
}

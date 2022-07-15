// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Observable} from 'rxjs';
import {
  LoadTourParameters,
  SaveTourParameters,
  Tour,
  LoadStateParameters,
  SaveStateParameters,
  TourState,
  DeleteStateParameters,
  DeleteTourParameters,
} from '../models';

export interface SaveTourCommand {
  parameters: SaveTourParameters;
  execute(): Observable<Tour>;
}

export interface LoadTourCommand {
  parameters: LoadTourParameters;
  execute(): Observable<Tour>;
}

export interface DeleteTourCommand {
  parameters: DeleteTourParameters;
  execute(): void;
}

export interface SaveStateCommand {
  parameters: SaveStateParameters;
  execute(): Observable<TourState>;
}

export interface LoadStateCommand {
  parameters: LoadStateParameters;
  execute(): Observable<TourState>;
}

export interface DeleteStateCommand {
  parameters: DeleteStateParameters;
  execute(): void;
}

export interface BaseCommand<T = unknown, S = unknown> {
  parameters: S;
  execute(): Observable<T> | void;
}

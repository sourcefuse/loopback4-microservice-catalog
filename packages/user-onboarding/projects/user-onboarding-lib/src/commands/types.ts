import { Observable } from 'rxjs';
import {
  LoadTourParameters,
  SaveTourParameters,
  Tour,
  LoadStateParameters,
  SaveStateParameters,
  TourState,
} from '../models';

export interface SaveTourCommand {
  parameters: SaveTourParameters;
  execute(): Observable<Tour>;
}

export interface LoadTourCommand {
  parameters: LoadTourParameters;
  execute(): Observable<Tour>;
}

export interface SaveStateCommand {
  parameters: SaveStateParameters;
  execute(): Observable<TourState>;
}

export interface LoadStateCommand {
  parameters: LoadStateParameters;
  execute(): Observable<TourState>;
}

export interface BaseCommand<T = unknown, S = unknown> {
  parameters: S;
  execute(): Observable<T>;
}

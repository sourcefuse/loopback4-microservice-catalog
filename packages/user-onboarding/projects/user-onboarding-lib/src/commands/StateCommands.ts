import { Observable, of } from "rxjs";
import { LoadStateParameters, SaveStateParameters, TourState } from "../models";
import { LoadStateCommand, SaveStateCommand } from "./types";
import { LOCAL_STORAGE, StorageService } from "ngx-webstorage-service";
import { Inject } from "@angular/core";

export class SaveSCommand implements SaveStateCommand{
  constructor(@Inject(LOCAL_STORAGE) private readonly storage: StorageService) { }
    public parameters: SaveStateParameters;
    execute(): Observable<TourState> {
        const newTourState = this.parameters.state;
        this.storage.set(newTourState.sessionId,newTourState);
        return of(newTourState);
      }
}

export class LoadSCommand implements LoadStateCommand{
  constructor(private readonly storage: StorageService) { }
    public parameters: LoadStateParameters;
    execute(): Observable<TourState> {
        const currentState = this.storage.get(this.parameters.state.sessionId); 
        return of(currentState);
      }
}
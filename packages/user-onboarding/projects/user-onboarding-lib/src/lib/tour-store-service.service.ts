import {Inject, Injectable} from '@angular/core';
import {
  DeleteStateParameters,
  DeleteTourParameters,
  LoadStateParameters,
  LoadTourParameters,
  SaveStateParameters,
  SaveTourParameters,
  Tour,
  TourState,
} from '../models';
import {
  DeleteSCommand,
  LoadSCommand,
  SaveSCommand,
} from '../commands/StateCommands';
import {
  DeleteTCommand,
  LoadTCommand,
  SaveTCommand,
} from '../commands/TourCommands';
import {
  BaseCommand,
  DeleteStateCommand,
  DeleteTourCommand,
  LoadStateCommand,
  LoadTourCommand,
  SaveStateCommand,
  SaveTourCommand,
} from '../commands/types';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TourStoreServiceService {
  private readonly commandMap = new Map<string, BaseCommand>();
  private readonly functionMap = new Map();
  private sessionId: string;
  private readonly defaultSSCommand = new SaveSCommand(this.storage);
  private readonly defaultSTCommand = new SaveTCommand(this.storage);
  private readonly defaultLSCommand = new LoadSCommand(this.storage);
  private readonly defaultLTCommand = new LoadTCommand(this.storage);
  private readonly defaultDSCommand = new DeleteSCommand(this.storage);
  private readonly defaultDTCommand = new DeleteTCommand(this.storage);

  constructor(@Inject(LOCAL_STORAGE) private readonly storage: StorageService) {
    this.commandMap.set('SaveTourCommand', this.defaultSTCommand);
    this.commandMap.set('LoadTourCommand', this.defaultLTCommand);
    this.commandMap.set('SaveStateCommand', this.defaultSSCommand);
    this.commandMap.set('LoadStateCommand', this.defaultLSCommand);
    this.commandMap.set('DeleteStateCommand', this.defaultDSCommand);
    this.commandMap.set('DeleteTourCommand', this.defaultDTCommand);
  }
  registerSaveTourCommand(cmd): void {
    this.commandMap.set('SaveTourCommand', cmd);
  }
  registerLoadTourCommand(cmd): void {
    this.commandMap.set('LoadTourCommand', cmd);
  }
  registerSaveStateCommand(cmd): void {
    this.commandMap.set('SaveStateCommand', cmd);
  }
  registerLoadStateCommand(cmd): void {
    this.commandMap.set('LoadStateCommand', cmd);
  }
  registerDeleteStateCommand(cmd): void {
    this.commandMap.set('DeleteStateCommand', cmd);
  }
  registerDeleteTourCommand(cmd): void {
    this.commandMap.set('DeleteTourCommand', cmd);
  }

  public saveTour(parameters: SaveTourParameters): Observable<Tour> {
    const command = this.commandMap.get('SaveTourCommand') as SaveTourCommand;
    command.parameters = parameters;
    return command.execute();
  }

  public loadTour(parameters: LoadTourParameters): Observable<Tour> {
    const command = this.commandMap.get('LoadTourCommand') as LoadTourCommand;
    command.parameters = parameters;
    return command.execute();
  }

  public deleteTour(parameters: DeleteTourParameters): void {
    const command = this.commandMap.get(
      'DeleteTourCommand',
    ) as DeleteTourCommand;
    command.parameters = parameters;
    return command.execute();
  }

  public saveState(parameters: SaveStateParameters): Observable<TourState> {
    const command = this.commandMap.get('SaveStateCommand') as SaveStateCommand;
    command.parameters = parameters;
    return command.execute();
  }

  public loadState(parameters: LoadStateParameters): Observable<TourState> {
    const command = this.commandMap.get('LoadStateCommand') as LoadStateCommand;
    command.parameters = parameters;
    return command.execute();
  }

  public deleteState(parameters: DeleteStateParameters): void {
    const command = this.commandMap.get(
      'DeleteStateCommand',
    ) as DeleteStateCommand;
    command.parameters = parameters;
    return command.execute();
  }

  public registerFnRef(key, fn: () => void): void {
    this.functionMap.set(key, fn);
  }

  public getFnByKey(key): () => void {
    return this.functionMap.get(key);
  }

  public createUUID(): string {
    let dt = new Date().getTime();
    const num1 = 16;
    const num2 = 0x3;
    const num3 = 0x8;
    const crypto = window.crypto || window.Crypto.prototype;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array); // Compliant for security-sensitive use cases
    const FileId = array[0];
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, x => {
      const r = (dt + FileId * num1) % num1 || 0;
      dt = Math.floor(dt / num1);
      return (x === 'x' ? r : (r && num2) || num3).toString(num1);
    });
  }

  public generateSessionId(): void {
    this.sessionId = this.createUUID();
    this.storage.set('TOUR_SESSION_ID', this.sessionId);
  }

  public getSessionId(): string {
    return this.storage.get('TOUR_SESSION_ID');
  }
}

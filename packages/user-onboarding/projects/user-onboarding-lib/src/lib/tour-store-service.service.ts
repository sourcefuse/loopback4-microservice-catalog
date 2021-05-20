import { Inject, Injectable } from '@angular/core';
import { LoadStateParameters, LoadTourParameters, SaveStateParameters, SaveTourParameters } from '../models';
import { LoadSCommand, LoadTCommand, SaveSCommand, SaveTCommand } from "../commands";
import { BaseCommand, LoadStateCommand, LoadTourCommand, SaveStateCommand, SaveTourCommand } from '../commands/types';
import { LOCAL_STORAGE, StorageService } from "ngx-webstorage-service";

@Injectable({
  providedIn: 'root'
})
export class TourStoreServiceService {
  private readonly commandMap = new Map<string, BaseCommand>();
  private readonly functionMap = new Map();
  private sessionId: string;
  private readonly defaultSSCommand = new SaveSCommand(this.storage);
  private readonly defaultSTCommand = new SaveTCommand(this.storage);
  private readonly defaultLSCommand = new LoadSCommand(this.storage);
  private readonly defaultLTCommand = new LoadTCommand(this.storage);

  constructor(@Inject(LOCAL_STORAGE) private readonly storage: StorageService) {
      this.commandMap.set("SaveTourCommand",this.defaultSTCommand);
      this.commandMap.set("LoadTourCommand",this.defaultLTCommand);
      this.commandMap.set("SaveStateCommand",this.defaultSSCommand);
      this.commandMap.set("LoadStateCommand",this.defaultLSCommand);
   }
  registerSaveTourCommand(cmd){
    this.commandMap.delete("SaveTourCommand");
    this.commandMap.set("SaveTourCommand",cmd);
  };
  registerLoadTourCommand(cmd){
    this.commandMap.delete("LoadTourCommand");
    this.commandMap.set("LoadTourCommand",cmd);
  };
  registerSaveStateCommand(cmd){
    this.commandMap.delete("SaveStateCommand");
    this.commandMap.set("SaveStateCommand",cmd);
  };
  registerLoadStateCommand(cmd){
    this.commandMap.delete("LoadStateCommand");
    this.commandMap.set("LoadStateCommand",cmd);
  };

  public saveTour(parameters: SaveTourParameters){
      const command = this.commandMap.get("SaveTourCommand") as SaveTourCommand;
      command.parameters = parameters;
      return command.execute();
  }

  public loadTour(parameters: LoadTourParameters){
      const command = this.commandMap.get("LoadTourCommand") as LoadTourCommand;
      command.parameters = parameters;
      return command.execute();
  }

  public saveState(parameters: SaveStateParameters){
      const command = this.commandMap.get("SaveStateCommand") as SaveStateCommand;
      command.parameters = parameters;
      return command.execute();
  }

  public loadState(parameters: LoadStateParameters){
      const command = this.commandMap.get("LoadStateCommand") as LoadStateCommand;
      command.parameters = parameters;
      return command.execute();
  }

  public registerFnRef(key, fn){
      this.functionMap.set(key,fn);
  }

  public getFnByKey(key){
    return this.functionMap.get(key);
  }

  // public registerIDGenerator(key){
  //   this.functionMap.set(key,this.create_UUID);
  // }

  public create_UUID(){
    var dt = new Date().getTime();
    var num1 = 16;
    var num2 = 0x3;
    var num3 = 0x8;
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*num1)%num1 | 0;
        dt = Math.floor(dt/num1);
        return (c==='x' ? r :(r&num2|num3)).toString(num1);
    });
    return uuid;
  }

  public generateSessionId(){
      this.sessionId = this.create_UUID();
      this.storage.set("TOUR_SESSION_ID",this.sessionId);
  }

  public getSessionId(){
    return this.storage.get("TOUR_SESSION_ID");
  }
}

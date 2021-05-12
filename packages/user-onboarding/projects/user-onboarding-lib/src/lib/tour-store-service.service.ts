import { Injectable } from '@angular/core';
import { LoadStateParameters, LoadTourParameters, SaveStateParameters, SaveTourParameters } from '../models';
import { LoadSCommand, LoadTCommand, SaveSCommand, SaveTCommand } from "../commands";
import { BaseCommand, LoadStateCommand, LoadTourCommand, SaveStateCommand, SaveTourCommand } from '../commands/types';


@Injectable({
  providedIn: 'root'
})
export class TourStoreServiceService {
  private readonly commandMap = new Map<string, BaseCommand>();
  private readonly functionMap = new Map();
  constructor() { }
  registerSaveTourCommand(cmd:SaveTCommand){
      this.commandMap.set("SaveTourCommand",cmd)
  };
  registerLoadTourCommand(cmd:LoadTCommand){
    this.commandMap.set("LoadTourCommand",cmd)
  };
  registerSaveStateCommand(cmd:SaveSCommand){
    this.commandMap.set("SaveStateCommand",cmd)
  };
  registerLoadStateCommand(cmd:LoadSCommand){
    this.commandMap.set("LoadStateCommand",cmd)
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
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  public loadID(){
      const UUID = this.create_UUID();
      return UUID;
  }

}

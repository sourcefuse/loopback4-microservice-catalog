import { Injectable, Inject } from '@angular/core';
import { LoadStateParameters, LoadTourParameters, SaveStateParameters, SaveTourParameters, Tour, TourState, TourStep } from '../models';
import { LoadSCommand, LoadTCommand, SaveSCommand, SaveTCommand } from "../commands"
import { Observable } from 'rxjs';
import { BaseCommand, LoadStateCommand, LoadTourCommand, SaveStateCommand, SaveTourCommand } from '../commands/types';
import { Command } from 'protractor';
import { partitionArray } from '@angular/compiler/src/util';

var stateSTORAGE_KEY = 'local_tourState';
var tourSTORAGE_KEY = 'local_tour'


@Injectable({
  providedIn: 'root'
})
export class TourStoreServiceService {
  private commandMap = new Map<string, BaseCommand>();
  private functionMap = new Map();
  constructor() { }
  registerSaveTourCommand(cmd:SaveTCommand){
      this.commandMap.set("SaveTourCommand",cmd)
  }
  registerLoadTourCommand(cmd:LoadTCommand){
    this.commandMap.set("LoadTourCommand",cmd)
  }
  registerSaveStateCommand(cmd:SaveSCommand){
    this.commandMap.set("SaveStateCommand",cmd)
  }
  registerLoadStateCommand(cmd:LoadSCommand){
    this.commandMap.set("LoadStateCommand",cmd)
  }

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
    const func = this.functionMap.get(key)
    return func;
  }


}

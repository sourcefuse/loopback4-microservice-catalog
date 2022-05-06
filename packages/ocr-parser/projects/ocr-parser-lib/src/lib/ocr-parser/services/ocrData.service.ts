import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FieldData } from '../models/ocr.model';

@Injectable()
export class OcrDataService {
  constructor() { }

  private readonly _selectedClauseData: BehaviorSubject<FieldData> = new BehaviorSubject(new FieldData());
  private readonly _updatedClauseValue: BehaviorSubject<string> = new BehaviorSubject('');
  private readonly _updatedClauseData: BehaviorSubject<FieldData> = new BehaviorSubject(new FieldData());
  
  $getSelectedClauseData = this._selectedClauseData.asObservable();
  $getUpdatedClauseValue = this._updatedClauseValue.asObservable();
  $getUpdatedClauseData = this._updatedClauseData.asObservable();


  setUpdatedClauseValue(data: string) {
    this._updatedClauseValue.next(data);
  }

  setSelectedClause(data: FieldData) {
    this._selectedClauseData.next(data);
  }

  setUpdatedClauseData(data: FieldData) {
    this._updatedClauseData.next(data);
  }
}

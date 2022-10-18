// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FieldData, SelectedClause} from '../models/ocr.model';

@Injectable()
export class OcrDataService {
  private readonly _selectedClauseData = new BehaviorSubject<SelectedClause>({
    isScroll: false,
    fieldData: new FieldData(),
  });
  private readonly _updatedClauseValue: BehaviorSubject<
    string
  > = new BehaviorSubject('');
  private readonly _updatedClauseData: BehaviorSubject<
    FieldData
  > = new BehaviorSubject(new FieldData());

  $getSelectedClauseData = this._selectedClauseData.asObservable();
  $getUpdatedClauseValue = this._updatedClauseValue.asObservable();
  $getUpdatedClauseData = this._updatedClauseData.asObservable();

  setUpdatedClauseValue(data: string) {
    this._updatedClauseValue.next(data);
  }

  setSelectedClause(data: SelectedClause) {
    this._selectedClauseData.next(data);
  }

  setUpdatedClauseData(data: FieldData) {
    this._updatedClauseData.next(data);
  }
}

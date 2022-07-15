// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FieldConfig, FieldData } from '../../models/ocr.model';
import { OcrDataService } from '../../services/ocrData.service';

@Component({
  selector: 'sourceloop-field-viewer',
  templateUrl: './field-viewer.component.html',
  styleUrls: ['./field-viewer.component.scss']
})
export class FieldViewerComponent implements OnInit, OnDestroy {

  @Input()
  data!: FieldConfig;
  color = '#78C000';
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly dataService: OcrDataService) { }


  ngOnInit(): void {
    this.subscription.add(this.dataService.$getUpdatedClauseValue.subscribe((text: string) => {
      const field = this.data.fieldData?.find((item: FieldData) => item.isSelected);
      if (field) {
        field.value = text;
        field.score = 100;
        this.dataService.setUpdatedClauseData(field);
      }
    }));
  }

  getUpdatedValue(value: string, clause: FieldData) {
    clause.value = value;
    this.onEmitFieldData(clause, false);
  }


  onEmitFieldData(data: FieldData, isScroll = false) {

    const field = this.data.fieldData?.find((item: FieldData) => item.isSelected);
    if (field)
      field.isSelected = false;
    data.isSelected = true;
    this.dataService.setSelectedClause({
      isScroll: isScroll,
      fieldData: data
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

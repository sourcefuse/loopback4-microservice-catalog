// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {Subscription} from 'rxjs';
import {FieldData} from '../../models/ocr.model';
import {OcrDataService} from '../../services/ocrData.service';

@Component({
  selector: 'sourceloop-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent implements OnInit, OnDestroy {
  @Input()
  data: any; //NOSONAR
  @Input()
  viewTemplate!: TemplateRef<HTMLElement>;
  selectedField: FieldData | undefined;
  textSubscription!: Subscription;
  @Output() tabChangeEvent = new EventEmitter();

  constructor(private readonly dataService: OcrDataService) {}

  ngOnInit(): void {
    this.textSubscription = this.dataService.$getSelectedClauseData.subscribe(
      resp => {
        this.selectedField = resp.fieldData;
      },
    );
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.tabChangeEvent.emit(tabChangeEvent.index);
  }

  ngOnDestroy(): void {
    this.textSubscription.unsubscribe();
  }
}

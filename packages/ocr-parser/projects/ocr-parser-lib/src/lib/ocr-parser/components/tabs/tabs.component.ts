import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { FieldData } from '../../models/ocr.model';
import { OcrDataService } from '../../services/ocrData.service';

@Component({
  selector: 'sourceloop-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, OnDestroy {
  @Input()
  data: any;
  @Input()
  viewTemplate!: TemplateRef<any>;
  selectedField: FieldData | undefined;
  textSubscription!: Subscription;
  @Output() tabChangeEvent = new EventEmitter();

  constructor(private readonly dataService: OcrDataService) { }

  ngOnInit(): void {
    this.textSubscription = this.dataService.$getSelectedClauseData.subscribe(resp => {
      this.selectedField = resp.fieldData;
    })
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.tabChangeEvent.emit(tabChangeEvent.index);
  }

  ngOnDestroy(): void {
    this.textSubscription.unsubscribe();
  }
}

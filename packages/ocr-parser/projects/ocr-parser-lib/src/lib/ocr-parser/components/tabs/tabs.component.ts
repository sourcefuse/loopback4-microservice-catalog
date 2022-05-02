import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
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
  constructor(private readonly dataService: OcrDataService) { }

  ngOnInit(): void {
    this.textSubscription = this.dataService.$getSelectedClauseData.subscribe(resp => {
      this.selectedField = resp;
    })
  }

  ngOnDestroy(): void {
    this.textSubscription.unsubscribe();
  }
}

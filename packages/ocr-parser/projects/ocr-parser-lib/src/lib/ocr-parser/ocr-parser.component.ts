import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentConfig, FieldConfig, FieldData } from './models/ocr.model';
import { OcrDataService } from './services/ocrData.service';

@Component({
  selector: 'sourceloop-ocrParser',
  templateUrl: './ocr-parser.component.html',
  styleUrls: ['./ocr-parser.component.scss']
})
export class OcrParserComponent implements OnInit, OnDestroy {
  @Input() documentConfig: DocumentConfig[] = [];
  @Input() fieldConfig: FieldConfig[] = [];
  @Output() emitUpdatedClause = new EventEmitter();
  private subscription: Subscription = new Subscription();
  private clausesData: FieldData[] = [];
  private selectedClause: FieldData = new FieldData();


  constructor(private readonly dataService: OcrDataService) {
  }

  ngOnInit(): void {
    this.subscription.add(this.dataService.$getUpdatedClauseData.subscribe(resp => {
      if (resp.id) {
        this.clausesData.push(resp);
      }
    }));
    this.subscription.add(this.dataService.$getSelectedClauseData.subscribe(resp => {
      if (resp.id) {
        this.selectedClause = resp;
      }
    }))
  }

  onCancelContract() {
    this.clausesData.forEach(data => {
      data.value = data.previousValue;
      data.isSelected = false;
    });
  }

  onApproveContract() {
    const updatedSelecedField = this.clausesData.find(field => field.isSelected);
    let data: FieldData;
    if (updatedSelecedField) {
      data = updatedSelecedField;
    } else {
      data = this.selectedClause;
    }
    data.isSelected = false;
    this.dataService.setSelectedClause({ ...data, value: '' })
    this.emitUpdatedClause.emit(this.clausesData);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

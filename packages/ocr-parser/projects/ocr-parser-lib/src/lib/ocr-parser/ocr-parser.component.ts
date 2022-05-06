import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentConfig, FieldConfig, FieldData } from './models/ocr.model';
import { OcrDataService } from './services/ocrData.service';

@Component({
  selector: 'sourceloop-ocr-parser',
  templateUrl: './ocr-parser.component.html',
  styleUrls: ['./ocr-parser.component.scss']
})
export class OcrParserComponent implements OnInit, OnDestroy {
  @Input() documentConfig: DocumentConfig[] = [];
  @Input() fieldConfig: FieldConfig[] = [];
  @Output() updatedClauseEvent = new EventEmitter();

  private subscription: Subscription = new Subscription();
  private clausesData: FieldData[] = [];
  private selectedClauses: FieldData[] = [];


  constructor(private readonly dataService: OcrDataService) {
  }

  ngOnInit(): void {
    this.subscription.add(this.dataService.$getUpdatedClauseData.subscribe(resp => {
      if (resp.id) {
        if (!this.checkAlreadyExistClause(this.clausesData, resp.id)) {
          this.clausesData.push(resp);
        } else {
          const index = this.clausesData.findIndex(data => data.id === resp.id);
          this.clausesData.splice(index, 1);
          this.clausesData.push(resp);
        }
        const slectedClauseIndex = this.selectedClauses.findIndex(data => data.id === resp.id);
        if (slectedClauseIndex >= 0) {
          this.selectedClauses.splice(slectedClauseIndex, 1);
        }
      }
    }));
    this.subscription.add(this.dataService.$getSelectedClauseData.subscribe(resp => {
      if (resp.id && resp.isSelected) {
        if (!this.checkAlreadyExistClause(this.selectedClauses, resp.id))
          this.selectedClauses.push(resp);
      }
    }))
  }

  checkAlreadyExistClause(clauses: FieldData[], clauseId: string): boolean {
    const clause = clauses.find(data => data.id === clauseId);
    return clause ? true : false
  }

  onCancelContract() {
    this.clausesData.forEach(data => {
      data.value = data.previousValue;
      data.isSelected = false;
    });
  }

  onApproveContract() {
    let selecedField: FieldData | undefined;
    if (this.clausesData.length) {
      selecedField = this.clausesData.find(field => field.isSelected);
    }
    if (!selecedField) {
      selecedField = this.selectedClauses.find(field => field.isSelected);
    }

    if (selecedField) {
      selecedField.isSelected = false;
      this.dataService.setSelectedClause({ ...selecedField, value: '' });
      this.clausesData.push(...this.selectedClauses);
      this.updatedClauseEvent.emit(this.clausesData);
      this.clausesData = [];
      this.selectedClauses = [];
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentConfig, FieldData } from '../../models/ocr.model';
import { OcrDataService } from '../../services/ocrData.service';

let timerId: any;

@Component({
  selector: 'sourceloop-html-viewer',
  templateUrl: './html-viewer.component.html',
  styleUrls: ['./html-viewer.component.scss']
})
export class HtmlViewerComponent implements OnInit, OnDestroy {

  @Input()
  data!: DocumentConfig;
  fieldValue: string = '';
  searchConfig = { separateWordSearch: false, accuracy: 'partially', acrossElements: true };
  private subscription: Subscription = new Subscription();


  constructor(private readonly dataService: OcrDataService, @Inject(DOCUMENT) private document: Document) {

  }

  ngOnInit(): void {
    this.subscription = this.dataService.$getSelectedClauseData.subscribe((data: FieldData) => {
      if (data.value) {
        this.fieldValue = data.value;
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          this.scrollToFirstMarkedText();
        }, 0);
      } else {
        this.fieldValue = ""
      }
    })
  }

  getSelectedText() {
    const selectedText = window.getSelection()?.toString().replace(/\s\s+/g, ' ').replace(/\n/g, ' ');
    if (selectedText) {
      this.fieldValue = selectedText;
      this.dataService.setUpdatedClauseDatavalue(this.fieldValue);
    }
  }




  scrollToFirstMarkedText() {
    const markedElements = this.document.getElementsByTagName('mark'); // it will return the array of marked
    if (markedElements.length) {
      markedElements[0].scrollIntoView({ // scroll to first mark text
        behavior: 'smooth'
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}

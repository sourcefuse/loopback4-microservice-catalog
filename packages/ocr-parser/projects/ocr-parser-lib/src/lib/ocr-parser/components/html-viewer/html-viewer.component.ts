import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { SelectionRectangle, TextSelectEvent } from '../../directives/text-select.directive';
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
  isSelectedClause = false;
  public hostRectangle!: SelectionRectangle | null;
  searchConfig = { separateWordSearch: false, accuracy: 'partially', acrossElements: true };
  private subscription: Subscription = new Subscription();


  constructor(private readonly dataService: OcrDataService, @Inject(DOCUMENT) private document: Document) {

  }

  ngOnInit(): void {
    this.subscription = this.dataService.$getSelectedClauseData.subscribe((data: FieldData) => {
      this.isSelectedClause = data.isSelected || false;
      if(data.supported_text) {
        this.fieldValue = data.supported_text;
        this.scrollToHighlightedText();
      } else if(data.value) {
        this.fieldValue = data.value;
        this.scrollToHighlightedText();
      } else {
        this.fieldValue = ""
      }
    })
  }


  scrollToHighlightedText() {
    this.subscription.add(timer(0).subscribe(() => {
      this.scrollToFirstMarkedText();
    }));
  }

  	// I render the rectangles emitted by the [textSelect] directive.
	public renderRectangles( event: TextSelectEvent ) : void {
		// If a new selection has been created, the viewport and host rectangles will
		// exist. Or, if a selection is being removed, the rectangles will be null.
    if(!this.isSelectedClause) {
      return
    }
    if(event.text) {
      this.fieldValue = event.text;
    }
		if ( event.hostRectangle ) {
 
			this.hostRectangle = event.hostRectangle;
 
		} else {
			this.hostRectangle = null;
		}
 
	}

  onUpdateClauseValue() {
    this.dataService.setUpdatedClauseValue(this.fieldValue);
  }

  scrollToFirstMarkedText() {
    const markedElements = this.document.getElementsByTagName('mark'); // it will return the array of marked
    console.log(markedElements);
    if (markedElements.length) {
      markedElements[markedElements.length-1].scrollIntoView({ // scroll to first mark text
        behavior: 'smooth',
        block: 'end'
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}

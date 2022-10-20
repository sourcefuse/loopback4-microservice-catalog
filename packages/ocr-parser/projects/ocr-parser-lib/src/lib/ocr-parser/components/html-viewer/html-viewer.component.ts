// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DOCUMENT} from '@angular/common';
import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {
  SelectionRectangle,
  TextSelectEvent,
} from '../../directives/text-select.directive';
import {DocumentConfig, SelectedClause} from '../../models/ocr.model';
import {OcrDataService} from '../../services/ocrData.service';

@Component({
  selector: 'sourceloop-html-viewer',
  templateUrl: './html-viewer.component.html',
  styleUrls: ['./html-viewer.component.scss'],
})
export class HtmlViewerComponent implements OnInit, OnDestroy {
  @Input()
  data!: DocumentConfig;
  fieldValue = '';
  isSelectedClause = false;
  updateIconUrl = '../../../../assets/icons/update.svg';
  public hostRectangle!: SelectionRectangle | null;
  searchConfig = {
    separateWordSearch: false,
    accuracy: 'partially',
    acrossElements: true,
  };
  private subscription: Subscription = new Subscription();

  constructor(
    private readonly dataService: OcrDataService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  ngOnInit(): void {
    this.subscription = this.dataService.$getSelectedClauseData.subscribe(
      (resp: SelectedClause) => {
        this.isSelectedClause = resp.fieldData.isSelected || false;
        if (!resp.isScroll) {
          return;
        }
        if (resp.fieldData.supportedText) {
          this.fieldValue = resp.fieldData.supportedText;
          this.scrollToHighlightedText();
        } else if (resp.fieldData.value) {
          this.fieldValue = resp.fieldData.value;
          this.scrollToHighlightedText();
        } else {
          this.fieldValue = '';
        }
      },
    );
  }

  scrollToHighlightedText() {
    this.subscription.add(
      timer(0).subscribe(() => {
        this.scrollToFirstMarkedText();
      }),
    );
  }

  // I render the rectangles emitted by the [textSelect] directive.
  public renderRectangles(event: TextSelectEvent): void {
    // If a new selection has been created, the viewport and host rectangles will
    // exist. Or, if a selection is being removed, the rectangles will be null.
    if (!this.isSelectedClause) {
      return;
    }
    if (event.text) {
      this.fieldValue = event.text;
    }
    if (event.hostRectangle) {
      this.hostRectangle = event.hostRectangle;
    } else {
      this.hostRectangle = null;
    }
  }

  onUpdateClauseValue() {
    this.dataService.setUpdatedClauseValue(this.fieldValue);
  }

  scrollToFirstMarkedText() {
    // it will return the array of marked
    const markedElements = this.document.getElementsByTagName('mark');
    if (markedElements.length) {
      markedElements[markedElements.length - 1].scrollIntoView({
        // scroll to first mark text
        behavior: 'smooth',
        block: 'end',
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

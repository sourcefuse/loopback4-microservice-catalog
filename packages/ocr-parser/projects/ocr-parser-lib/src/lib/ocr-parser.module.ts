// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { NgModule } from '@angular/core';
import { OcrParserComponent} from './ocr-parser/ocr-parser.component';
import { TabsComponent } from './ocr-parser/components/tabs/tabs.component';
import { FieldViewerComponent } from './ocr-parser/components/field-viewer/field-viewer.component';
import { HtmlViewerComponent } from './ocr-parser/components/html-viewer/html-viewer.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxMarkjsModule } from 'ngx-markjs';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { NoSanitizePipe } from './ocr-parser/pipes/dom-sanitizer.pipe';
import { OcrDataService } from './ocr-parser/services/ocrData.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextSelectDirective } from './ocr-parser/directives/text-select.directive';
import { FlexLayoutModule } from '@angular/flex-layout';




@NgModule({
  declarations: [
    OcrParserComponent,
    TabsComponent,
    FieldViewerComponent,
    HtmlViewerComponent,
    NoSanitizePipe,
    TextSelectDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    NgxMarkjsModule,
    FlexLayoutModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
  ],
  providers: [OcrDataService],
  exports: [
    OcrParserComponent
  ]
})
export class OcrParserModule { }

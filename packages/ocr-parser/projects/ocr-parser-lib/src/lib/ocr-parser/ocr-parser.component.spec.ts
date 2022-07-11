// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OcrParserComponent } from './ocr-parser.component';


describe('OcrParserLibComponent', () => {
  let component: OcrParserComponent;
  let fixture: ComponentFixture<OcrParserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcrParserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcrParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

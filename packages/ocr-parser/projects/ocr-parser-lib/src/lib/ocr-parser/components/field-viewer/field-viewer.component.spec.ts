﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FieldViewerComponent} from './field-viewer.component';

describe('FieldViewerComponent', () => {
  let component: FieldViewerComponent;
  let fixture: ComponentFixture<FieldViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FieldViewerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { TestBed } from '@angular/core/testing';

import { FakeBackendHttpInterceptor } from './fake-backend-http.interceptor';

describe('FakeBackendHttpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FakeBackendHttpInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: FakeBackendHttpInterceptor = TestBed.inject(FakeBackendHttpInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

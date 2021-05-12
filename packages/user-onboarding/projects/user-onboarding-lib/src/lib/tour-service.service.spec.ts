import { TestBed } from '@angular/core/testing';

import { TourServiceService } from './tour-service.service';

describe('TourServiceService', () => {
  let service: TourServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

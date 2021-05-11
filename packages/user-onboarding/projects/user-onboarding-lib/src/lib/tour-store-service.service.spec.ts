import { TestBed } from '@angular/core/testing';

import { TourStoreServiceService } from './tour-store-service.service';

describe('TourStoreServiceService', () => {
  let service: TourStoreServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourStoreServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

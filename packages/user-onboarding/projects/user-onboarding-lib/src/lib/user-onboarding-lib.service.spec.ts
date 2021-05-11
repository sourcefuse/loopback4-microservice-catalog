import { TestBed } from '@angular/core/testing';

import { UserOnboardingLibService } from './user-onboarding-lib.service';

describe('UserOnboardingLibService', () => {
  let service: UserOnboardingLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserOnboardingLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOnboardingLibComponent } from './user-onboarding-lib.component';

describe('UserOnboardingLibComponent', () => {
  let component: UserOnboardingLibComponent;
  let fixture: ComponentFixture<UserOnboardingLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOnboardingLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOnboardingLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

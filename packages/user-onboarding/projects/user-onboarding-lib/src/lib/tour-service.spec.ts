import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {TourServiceService} from './tour-service.service';
import {TourStoreServiceService} from './tour-store-service.service';
import {filterFn, newTour} from '../mocks/tourStore.mocks';
import {of} from 'rxjs';
describe('TourServiceService', () => {
  let service: TourStoreServiceService;
  let tourService: TourServiceService;
  const valueServiceSpy = jasmine.createSpyObj('TourStoreService', [
    'loadTour',
    'getSessionId',
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule],
      providers: [
        TourServiceService,
        TourStoreServiceService,
        {provide: TourStoreServiceService, useValue: valueServiceSpy},
      ],
    });
    tourService = TestBed.inject(TourServiceService);
  });
  it('Should set max time', () => {
    const maxTime = 3000;
    const result = tourService.maxWaitTime;
    expect(result).toBeGreaterThan(0);
    expect(result).toEqual(maxTime);
  });
  it('Should get maximum time', () => {
    const maxTime = 3000;
    const result = tourService.maxWaitTime;
    expect(result).toEqual(maxTime);
  });
  it('Should set exitOnEsc', () => {
    const result = tourService.exitOnEsc;
    expect(result).toEqual(true);
  });
  it('Should get exitOnEsc', () => {
    const result = tourService.exitOnEsc;
    expect(result).toEqual(true);
  });
  it('Should run the tour ', () => {
    const sessionId = '1';
    valueServiceSpy.loadTour.and.callFake(() => of(newTour));
    valueServiceSpy.getSessionId.and.callFake(() => sessionId);
    tourService.run('1', {key: 'Skip'}, {}, filterFn, {});
    expect(valueServiceSpy.loadTour).toHaveBeenCalledWith({
      tourId: '1',
      sessionId,
    });
  });
});

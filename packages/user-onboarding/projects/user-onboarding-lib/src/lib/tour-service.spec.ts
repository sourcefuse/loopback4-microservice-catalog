import {HttpClientTestingModule} from '@angular/common/http/testing';
import {fakeAsync, flush, TestBed} from '@angular/core/testing';
import {TourServiceService} from './tour-service.service';
import {TourStoreServiceService} from './tour-store-service.service';
import {filterFn, newTour} from '../mocks/tourStore.mocks';
import {of} from 'rxjs';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
describe('TourServiceService', () => {
  let service: TourStoreServiceService;
  let tourService: TourServiceService;
  let router: Router;
  const storeServiceSpy = jasmine.createSpyObj('TourStoreService', [
    'loadTour',
    'getSessionId',
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        TourServiceService,
        TourStoreServiceService,
        {provide: TourStoreServiceService, useValue: storeServiceSpy},
      ],
    });
    tourService = TestBed.inject(TourServiceService);
  });
  it('should have default max wait time as 3000', () => {
    const maxTime = 3000;
    const result = tourService.maxWaitTime;
    expect(result).toEqual(maxTime);
  });
  it('should have default exitOnEsc as true', () => {
    const result = tourService.exitOnEsc;
    expect(result).toEqual(true);
  });

  it('should run the tour ', fakeAsync(() => {
    const sessionId = '1';
    storeServiceSpy.loadTour.and.callFake(() => of(newTour));
    storeServiceSpy.getSessionId.and.callFake(() => sessionId);
    const triggerTourSpy = spyOn<any>(tourService, 'triggerTour'); //NOSONAR
    triggerTourSpy.and.callFake(() => {});
    tourService.run('1', {key: 'Skip'}, {}, filterFn, {});
    flush();
    expect(triggerTourSpy).toHaveBeenCalledOnceWith(newTour, {});
    expect(storeServiceSpy.loadTour).toHaveBeenCalledWith({
      tourId: '1',
      sessionId,
    });
  }));
});

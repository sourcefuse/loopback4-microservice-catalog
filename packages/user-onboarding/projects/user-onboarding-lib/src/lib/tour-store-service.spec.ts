import {HttpClientTestingModule} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {TourStoreServiceService} from './tour-store-service.service';
import {
  argFn,
  argFunction,
  commandDS,
  commandDT,
  commandLS,
  commandLT,
  commandSS,
  commandST,
  parameterDS,
  parameterDT,
  parameterLS,
  parameterLT,
  parameterSS,
  parameterST,
  sessionId,
} from '../mocks/tourStore.mocks';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';
describe('TourStoreServiceService', () => {
  let service: TourStoreServiceService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule],
      providers: [TourStoreServiceService],
    });
    service = TestBed.inject(TourStoreServiceService);
  });
  it('Service injected via inject([TourStoreServiceService] and TestBed.inject(TourStoreServiceServiceshould be the same instance) ', inject(
    [TourStoreServiceService],
    (injectedService: TourStoreServiceService) => {
      expect(injectedService).toBeTruthy();
      expect(injectedService).toBe(service);
    },
  ));
  it('Register Save tour Command', () => {
    service.registerSaveTourCommand(commandST);
    expect(service['commandMap'].get('SaveTourCommand')).toEqual(commandST);
  });
  it('Register Load tour Command', () => {
    service.registerLoadTourCommand(commandLT);
    expect(service['commandMap'].get('LoadTourCommand')).toEqual(commandLT);
  });
  it('Register Save State Command', () => {
    service.registerSaveStateCommand(commandSS);
    expect(service['commandMap'].get('SaveStateCommand')).toEqual(commandSS);
  });
  it('Register Load State Command', () => {
    service.registerLoadStateCommand(commandLS);
    expect(service['commandMap'].get('LoadStateCommand')).toEqual(commandLS);
  });
  it('Register Delete State Command', () => {
    service.registerDeleteStateCommand(commandDS);
    expect(service['commandMap'].get('DeleteStateCommand')).toEqual(commandDS);
  });
  it('Register Delete Tour Command', () => {
    service.registerDeleteTourCommand(commandDT);
    expect(service['commandMap'].get('DeleteTourCommand')).toEqual(commandDT);
  });
  it('Should set the parameters and execute function in save tour function', () => {
    service['commandMap'].set('SaveTourCommand', commandST);
    service.saveTour(parameterST);
    expect(commandST.parameters).toEqual(parameterST);
    expect(commandST.execute).toHaveBeenCalledOnceWith();
  });
  it('Should set the parameters and execute function in Load tour function', () => {
    service['commandMap'].set('LoadTourCommand', commandLT);
    service.loadTour(parameterLT);
    expect(commandLT.parameters).toEqual(parameterLT);
    expect(commandLT.execute).toHaveBeenCalledOnceWith();
  });
  it('Should set the parameters and execute function in Save State function', () => {
    service['commandMap'].set('SaveStateCommand', commandSS);
    service.saveState(parameterSS);
    expect(commandSS.parameters).toEqual(parameterSS);
    expect(commandSS.execute).toHaveBeenCalled();
  });
  it('Should set the parameters and execute function in Load State function', () => {
    service['commandMap'].set('LoadStateCommand', commandLS);
    service.loadState(parameterLS);
    expect(commandLS.parameters).toEqual(parameterLS);
    expect(commandLS.execute).toHaveBeenCalled();
  });
  it('Should set the parameters and execute function in Delete state function', () => {
    service['commandMap'].set('DeleteStateCommand', commandDS);
    spyOn(commandDS, 'execute').and.callThrough();
    service.deleteState(parameterDS);
    expect(commandDS.parameters).toEqual(parameterDS);
    expect(commandDS.execute).toHaveBeenCalled();
  });
  it('Should set the parameters and execute function in Delete Tour function', () => {
    service['commandMap'].set('DeleteTourCommand', commandDT);
    spyOn(commandDT, 'execute').and.callThrough();
    service.deleteTour(parameterDT);
    expect(commandDT.parameters).toEqual(parameterDT);
    expect(commandDT.execute).toHaveBeenCalled();
  });
  it('Should register Function Reference by Key', () => {
    service.registerFnRef('skipAction', argFunction);
    const fn = service['functionMap'].get('skipAction');
    expect(fn).toEqual(argFunction);
  });
  it('Should get register Function Reference by Key', () => {
    service['functionMap'].set('skipAction', argFunction);
    service.getFnByKey('skipAction');
    expect(service['functionMap'].get('skipAction')).toEqual(argFunction);
  });
  it('Should get sessionId', inject(
    [LOCAL_STORAGE],
    (storage: StorageService) => {
      storage.set('TOUR_SESSION_ID', sessionId);
      const id = service.getSessionId();
      expect(id).toEqual(sessionId);
    },
  ));
  it('Should set Session IdGenerator ', () => {
    service.setSessionIdGenerator(argFn);
    expect(service['sessionGenerator']).toEqual(argFn);
  });
  afterEach(() => {
    service['commandMap'].clear();
    service['functionMap'].clear();
    service = null;
  });
});

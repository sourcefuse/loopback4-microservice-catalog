import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SearchComponent} from './search.component';
import {IReturnType, SEARCH_SERVICE_TOKEN} from '../types';
import {
  emittedValue,
  IReturnMockValue,
  ISearchMockValue,
  mockCategory,
  mockConfig,
  mockEvent,
  mockFunction,
  mockIModel,
  mockNoEvent,
  mockOnChange,
  MockSearchService,
  mockSuggestion,
  mockSuggestionUrl,
  recentSearch,
  url,
} from './mocks/search.component.mock';
import {of, throwError} from 'rxjs';
describe('SearchComponent', () => {
  let component: SearchComponent<IReturnType>;
  let fixture: ComponentFixture<SearchComponent<IReturnType>>;
  const mockServiceSpy = jasmine.createSpyObj(MockSearchService, [
    'recentSearchApiRequest',
    'searchApiRequest',
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      providers: [{provide: SEARCH_SERVICE_TOKEN, useValue: mockServiceSpy}],
    });

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    spyOnProperty(component, 'config', 'get').and.callFake(() => mockConfig);
  });
  it('Should create component', () => {
    expect(fixture).toBeDefined();
    expect(component).toBeTruthy();
  });
  it('Should set the config', () => {
    component.config = mockConfig;
    expect(component['_config']).toEqual(mockConfig);
  });
  it('Should subscribe searchRequest$ and emit a response', () => {
    spyOn(component.searched, 'emit');
    spyOn(component, 'getSuggestions').and.callThrough();
    const searchSpy = spyOn(component.searchRequest$, 'subscribe');
    component.ngOnInit();
    component.searchRequest$.subscribe(res => {
      expect(res).toEqual(emittedValue);
      expect(component.getSuggestions).toHaveBeenCalledWith(emittedValue);
    });
    expect(searchSpy).toHaveBeenCalled();
  });
  it('Should implement ControlValueAccessor write value method', () => {
    component.writeValue('User');
    expect(component.searchBoxInput).toEqual('User');
  });
  it('Should implement ControlValueAccessor register on touched method', () => {
    component.registerOnTouched(mockFunction);
    expect(component.onTouched).toEqual(mockFunction);
  });
  it('Should implement ControlValueAccessor register on change method', () => {
    component.registerOnChange(mockOnChange);
    expect(component.onChange).toEqual(mockOnChange);
  });
  it('Should not get suggestions if no input in search box input', () => {
    mockServiceSpy.searchApiRequest.and.callFake(() => of(IReturnMockValue));
    spyOn(component, 'getSuggestions');
    component.getSuggestions(mockNoEvent);
    expect(component.getSuggestions(mockNoEvent)).not.toBeDefined();
  });
  it('Should get suggestions on some search input', () => {
    mockServiceSpy.searchApiRequest.and.callFake(() => of(IReturnMockValue));
    component.getSuggestions(mockEvent);
    expect(component.suggestions).toEqual(IReturnMockValue);
    expect(component.searching).toBeFalse();
  });
  it('Should not give suggestions for some input in case of an error', () => {
    mockServiceSpy.searchApiRequest.and.callFake(() => throwError(Error));
    component.getSuggestions(mockEvent);
    expect(component.suggestions).toEqual([]);
    expect(component.searching).toBeFalse();
  });
  it('Should give recent searches for the input value being searched ', () => {
    mockServiceSpy.recentSearchApiRequest.and.callFake(() =>
      of(ISearchMockValue),
    );
    component.getRecentSearches();
    expect(component.recentSearches).toEqual(ISearchMockValue);
  });
  it('Should give no search inputs in case of an error ', () => {
    mockServiceSpy.recentSearchApiRequest.and.callFake(() => throwError(Error));
    component.getRecentSearches();
    expect(component.recentSearches).toEqual([]);
  });
  it('Should hit search api method ', () => {
    const searchSpy = spyOn(component.searchRequest$, 'subscribe');
    mockServiceSpy.recentSearchApiRequest.and.callFake(() =>
      of(ISearchMockValue),
    );
    component.hitSearchApi();
    component.searchRequest$.subscribe(res => {
      expect(res).toEqual(emittedValue);
    });
    expect(searchSpy).toHaveBeenCalled();
  });
  it('Should call the focus search input element', () => {
    component.searchInputElement = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['focus']),
    };
    component.focusInput();
    expect(component.searchInputElement.nativeElement.focus).toHaveBeenCalled();
  });
  it('should return bold string', () => {
    const inputString = 'User';
    const result = component.boldString('User', 'Input');
    expect(result).toEqual(inputString);
  });
  it('Should hide the suggestions', () => {
    component.onTouched = jasmine.createSpy();
    component.hideSuggestions();
    expect(component.suggestionsDisplay).toEqual(false);
    expect(component.onTouched).toHaveBeenCalled();
  });
  it('Should show the suggestions', () => {
    const spyObj = spyOn(component, 'getRecentSearches');
    component.showSuggestions();
    expect(component.suggestionsDisplay).toEqual(true);
    expect(spyObj).toHaveBeenCalledTimes(1);
  });
  it('Should show category', () => {
    component.showCategory();
    expect(component.categoryDisplay).toEqual(true);
  });
  it('Should hide category', () => {
    component.hideCategory();
    expect(component.categoryDisplay).toEqual(false);
  });

  it('Should return categoryToSourceName', () => {
    const result = component._categoryToSourceName('User');
    expect(result).toEqual(mockCategory);
  });
  it('Should set the category', () => {
    const obj = spyOn(component, 'setCategory');
    spyOn(component, 'getSuggestions').and.callThrough();
    component.setCategory('All');
    expect(obj).toHaveBeenCalledWith('All');
    expect(component.category).toEqual('All');
    expect(component.categoryDisplay).toEqual(false);
  });
  it('Should set the category in case of input in search box', () => {
    component.searchBoxInput = 'User';
    spyOn(component, 'hitSearchApi').and.callThrough();
    spyOn(component, 'getSuggestions');
    mockServiceSpy.recentSearchApiRequest.and.callFake(() =>
      of(ISearchMockValue),
    );
    spyOn(component, 'focusInput').and.stub();
    spyOn(component, 'showSuggestions').and.callThrough();
    component.setCategory('All');
    expect(component.hitSearchApi).toHaveBeenCalledTimes(1);
    expect(component.showSuggestions).toHaveBeenCalledTimes(1);
  });
  it('Should reset the input', () => {
    spyOn(component, 'focusInput').and.stub();
    component.onChange = jasmine.createSpy();
    spyOn(component, 'getRecentSearches').and.callFake(() => of([]));
    mockServiceSpy.recentSearchApiRequest.and.callFake(() => of([]));
    component.resetInput();
    expect(component.searchBoxInput).toEqual('');
    expect(component.suggestions).toEqual([]);
    expect(component.suggestionsDisplay).toEqual(true);
    expect(component.focusInput).toHaveBeenCalledTimes(1);
    expect(component.onChange).toHaveBeenCalledTimes(1);
    expect(component.getRecentSearches).toHaveBeenCalled();
  });
  it('Should unsubscribe searchRequest$ on calling ng on destroy', () => {
    fixture.detectChanges();
    let searchRequestSpy = spyOn(component.searchRequest$, 'unsubscribe');
    component.ngOnDestroy();
    expect(searchRequestSpy).toHaveBeenCalled();
  });
  it('Should get model from model name', () => {
    const model = component.getModelFromModelName('User');
    expect(model).toEqual(mockIModel);
  });
  it('Should fetch Model ImageUrl From Suggestion', () => {
    const returnUrl = component.fetchModelImageUrlFromSuggestion(
      mockSuggestionUrl,
    );
    expect(returnUrl).toEqual(url);
  });
  it('Should populate searched input value from the user', () => {
    spyOn(component, 'getSuggestions');
    spyOn(component.clicked, 'emit');
    component.onChange = jasmine.createSpy();
    component.populateValue(mockSuggestion, new MouseEvent('click'));
    expect(component.searchBoxInput).toEqual('User');
    expect(component.suggestionsDisplay).toEqual(false);
    expect(component.onChange).toHaveBeenCalled();
    expect(component.getSuggestions).toHaveBeenCalled();
    expect(component.clicked.emit).toHaveBeenCalled();
  });
  it('Should populate value searched recently', () => {
    spyOn(component, 'getSuggestions').and.callThrough();
    mockServiceSpy.searchApiRequest.and.callFake(() => of(IReturnMockValue));
    spyOn(component, 'showSuggestions').and.callThrough();
    mockServiceSpy.recentSearchApiRequest.and.callFake(() => of([]));
    component.onChange = jasmine.createSpy();
    spyOn(component, 'focusInput').and.stub();
    component.populateValueRecentSearch(recentSearch, new MouseEvent('click'));
    expect(component.searchBoxInput).toEqual('user');
    expect(component.getSuggestions).toHaveBeenCalled();
    expect(component.onChange).toHaveBeenCalledOnceWith(recentSearch['match']);
    expect(component.focusInput).toHaveBeenCalled();
    expect(component.showSuggestions).toHaveBeenCalled();
  });
  it('Should fetch Model ImageUrl From Suggestion', () => {
    const urlValue = undefined;
    const returnUrl = component.fetchModelImageUrlFromSuggestion(
      mockSuggestion,
    );
    expect(returnUrl).toEqual(urlValue);
  });
  it('Should get Models With Suggestions', () => {
    const result = component.getModelsWithSuggestions();
    expect(result).toEqual([]);
  });
});

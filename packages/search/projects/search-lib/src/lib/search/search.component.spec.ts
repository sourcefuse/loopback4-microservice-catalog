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
  mockOnChange,
  MockSearchService,
  mockSuggestion,
  mockSuggestionUrl,
  url,
} from './mocks/search.component.mock';
import {of} from 'rxjs';
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
  it('Should hit search api for a particular event', () => {
    component.hitSearchApi();
  });
  it('Should call searchRequest$.next in hit search Api method', () => {
    component.searchRequest$.subscribe(res =>
      expect(res).toEqual(emittedValue),
    );
  });
  it('Should get suggestions on some search input', () => {
    mockServiceSpy.searchApiRequest.and.callFake(() => of(IReturnMockValue));
    component.getSuggestions(mockEvent);
    expect(component.suggestions).toEqual(IReturnMockValue);
    expect(component.searching).toBeFalse();
  });

  it('Should not give suggestions for some input in case of an error', () => {
    mockServiceSpy.searchApiRequest.and.callFake(() => of([]));
    component.getSuggestions(mockEvent);
    expect(component.suggestions).toEqual([]);
    expect(component.searching).toBeFalse();
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

  it('Should give recent searches for the input value being searched ', () => {
    mockServiceSpy.recentSearchApiRequest.and.callFake(() =>
      of(ISearchMockValue),
    );
    component.getRecentSearches();
    expect(component.recentSearches).toEqual(ISearchMockValue);
  });
  it('Should give no search inputs in case of an error ', () => {
    mockServiceSpy.recentSearchApiRequest.and.callFake(() => of([]));
    component.getRecentSearches();
    expect(component.recentSearches).toEqual([]);
  });
  it('Should return categoryToSourceName', () => {
    const result = component._categoryToSourceName('User');
    expect(result).toEqual(mockCategory);
  });
  it('Should set the category', () => {
    const obj = spyOn(component, 'setCategory');
    component.setCategory('All');
    expect(obj).toHaveBeenCalledWith('All');
    expect(component.category).toEqual('All');
    expect(component.categoryDisplay).toEqual(false);
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

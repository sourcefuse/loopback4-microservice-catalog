// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {Configuration} from '../lib-configuration';
import {Subject} from 'rxjs';
import {debounceTime, tap} from 'rxjs/operators';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {
  ISearchService,
  ISearchQuery,
  SEARCH_SERVICE_TOKEN,
  DEBOUNCE_TIME,
  DEFAULT_LIMIT,
  DEFAULT_LIMIT_TYPE,
  DEFAULT_OFFSET,
  DEFAULT_SAVE_IN_RECENTS,
  DEFAULT_ORDER,
  IReturnType,
  RecentSearchEvent,
  TypeEvent,
  ItemClickedEvent,
  IModel,
  ISearchServiceWithPromises,
  isApiServiceWithPromise,
} from '../types';
import {isPlatformBrowser} from '@angular/common';
import {PromiseApiAdapterService} from './promise-api-adapter.service';

const ALL_LABEL = 'All';
@Component({
  selector: 'sourceloop-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SearchComponent,
      multi: true,
    },
  ],
})
export class SearchComponent<T extends IReturnType>
  implements OnInit, OnDestroy, ControlValueAccessor
{
  searchBoxInput = '';
  suggestionsDisplay = false;
  categoryDisplay = false;
  searching = false;
  suggestions: T[] = [];
  recentSearches: ISearchQuery[] = [];
  category: string = ALL_LABEL;
  searchRequest$ = new Subject<{input: string; event: Event}>();

  private _config!: Configuration<T>;
  public get config(): Configuration<T> {
    return this._config;
  }

  @Input()
  public set config(value: Configuration<T>) {
    this._config = value;

    if (value && value.models) {
      value.models.unshift({
        name: ALL_LABEL,
        displayName: ALL_LABEL,
      });
    } else if (value && !value.models) {
      value.models = [
        {
          name: ALL_LABEL,
          displayName: ALL_LABEL,
        },
      ];
    } else {
      // do nothing
    }
  }

  @Input()
  public set searchProvider(
    value: ISearchService<T> | ISearchServiceWithPromises<T>,
  ) {
    if (isApiServiceWithPromise(value)) {
      value = this.promiseAdapter.adapt(value);
    }
    this.searchService = value;
  }

  public get searchProvider(): ISearchService<T> {
    return this.searchService;
  }

  @Input() titleTemplate?: TemplateRef<any>;
  @Input() subtitleTemplate?: TemplateRef<any>;
  // emitted when user clicks one of the suggested results (including recent search sugestions)
  @Output() clicked = new EventEmitter<ItemClickedEvent<T>>();
  @Output() searched = new EventEmitter<RecentSearchEvent>();
  /* emitted when user makes search request (including recent search requests
     & requests made on change in category from dropdown)
  In case of recent search Array of recent Search request result is emitted */

  onChange: (value: string | undefined) => void = () => {};
  onTouched: () => void = () => {};
  disabled = false;

  @ViewChild('searchInput') public searchInputElement!: ElementRef;

  constructor(
    @Inject(SEARCH_SERVICE_TOKEN)
    @Optional()
    private searchService: ISearchService<T>,
    // tslint:disable-next-line:ban-types
    @Inject(PLATFORM_ID)
    private readonly platformId: Object,
    private readonly cdr: ChangeDetectorRef,
    private readonly promiseAdapter: PromiseApiAdapterService<T>,
  ) {}

  ngOnInit(): void {
    this.searchRequest$
      .pipe(
        tap(v => (this.suggestions = [])),
        debounceTime(DEBOUNCE_TIME),
      )
      .subscribe((value: TypeEvent) => {
        this.searched.emit({
          event: value.event,
          keyword: value.input,
          category: this.category,
        });
        this.getSuggestions(value);
        this.cdr.markForCheck();
      });
  }

  // ControlValueAccessor Implementation
  writeValue(value: string): void {
    this.searchBoxInput = value;
  }
  // When the value in the UI is changed, this method will invoke a callback function
  registerOnChange(fn: (value: string | undefined) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getSuggestions(eventValue: TypeEvent) {
    eventValue.input = eventValue.input.trim();
    if (!eventValue.input.length) {
      return;
    }
    const order = this.config.order ?? DEFAULT_ORDER;
    let orderString = '';
    order.forEach(preference => (orderString = `${orderString}${preference} `));

    let saveInRecents = this.config.saveInRecents ?? DEFAULT_SAVE_IN_RECENTS;
    if (this.config.saveInRecents && this.config.saveInRecentsOnlyOnEnter) {
      if (
        !eventValue.event ||
        (eventValue.event instanceof KeyboardEvent &&
          eventValue.event.key === 'Enter')
      ) {
        saveInRecents = true; // save in recents only on enter or change in category
      } else {
        // do not save in recent search on typing
        saveInRecents = false;
      }
    }
    /* need to put default value here and not in contructor
    because sonar was giving code smell with definite assertion as all these
     parameters are optional */
    const requestParameters: ISearchQuery = {
      match: eventValue.input,
      sources: this._categoryToSourceName(this.category),
      limit: this.config.limit ?? DEFAULT_LIMIT,
      limitByType: this.config.limitByType ?? DEFAULT_LIMIT_TYPE,
      order: orderString,
      offset: this.config.offset ?? DEFAULT_OFFSET,
    };

    this.searching = true;
    this.cdr.markForCheck();
    this.searchService
      .searchApiRequest(requestParameters, saveInRecents)
      .subscribe(
        (value: T[]) => {
          this.suggestions = value;
          this.searching = false;
          this.cdr.markForCheck();
        },
        (_error: Error) => {
          this.suggestions = [];
          this.searching = false;
          this.cdr.markForCheck();
        },
      );
  }
  getRecentSearches() {
    if (
      !this.config.hideRecentSearch &&
      this.searchService.recentSearchApiRequest
    ) {
      this.searchService.recentSearchApiRequest().subscribe(
        (value: ISearchQuery[]) => {
          this.recentSearches = value;
          this.cdr.markForCheck();
        },
        (_error: Error) => {
          this.recentSearches = [];
          this.cdr.markForCheck();
        },
      );
    }
  }

  //event can be KeyBoardEvent or Event of type 'change'
  // fired on change in value of drop down for category

  hitSearchApi(event?: Event) {
    // this will happen only in case user searches something and
    // then erases it, we need to update recent search
    if (!this.searchBoxInput) {
      this.suggestions = [];
      this.getRecentSearches();
      return;
    }

    // no debounce time needed in case of searchOnlyOnEnter
    if (this.config.searchOnlyOnEnter) {
      if (!event || (event instanceof KeyboardEvent && event.key === 'Enter')) {
        this.getSuggestions({input: this.searchBoxInput, event});
      }
      return;
    }

    // no debounce time needed in case of change in category
    if (!event) {
      this.getSuggestions({input: this.searchBoxInput, event});
      return;
    }

    this.searchRequest$.next({
      input: this.searchBoxInput,
      event,
    });
  }

  populateValue(suggestion: T, event: MouseEvent) {
    const value = suggestion[
      this.config.displayPropertyName
    ] as unknown as string;
    // converted to string to assign value to searchBoxInput
    this.searchBoxInput = value;
    this.suggestionsDisplay = false;
    // ngModelChange doesn't detect change in value
    // when populated from outside, hence calling manually
    this.onChange(this.searchBoxInput);
    // need to do this to show more search options for selected
    //suggestion - just in case user reopens search input
    this.getSuggestions({input: this.searchBoxInput, event});
    this.clicked.emit({item: suggestion, event});
  }
  populateValueRecentSearch(recentSearch: ISearchQuery, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    const value = recentSearch['match'];
    this.searchBoxInput = value;
    this.suggestionsDisplay = false;
    this.onChange(this.searchBoxInput);
    // need to do this to show more search options for selected
    // suggestion - just in case user reopens search input
    this.getSuggestions({input: this.searchBoxInput, event});
    this.focusInput();
    this.showSuggestions();
  }

  fetchModelImageUrlFromSuggestion(suggestion: T) {
    const modelName = suggestion[
      'source' as unknown as keyof T
    ] as unknown as string;
    let url: string | undefined;
    this.config.models.forEach(model => {
      if (model.name === modelName && model.imageUrl) {
        url = model.imageUrl;
      }
    });
    return url;
  }

  boldString(str: T[keyof T] | string, substr: string) {
    const strRegExp = new RegExp(`(${substr})`, 'gi');
    const stringToMakeBold: string = str as unknown as string;
    return stringToMakeBold.replace(strRegExp, `<b>$1</b>`);
  }

  hideSuggestions() {
    this.suggestionsDisplay = false;
    this.onTouched();
  }

  showSuggestions() {
    this.suggestionsDisplay = true;
    this.getRecentSearches();
  }

  focusInput() {
    if (isPlatformBrowser(this.platformId)) {
      this.searchInputElement.nativeElement.focus();
    }
  }

  setCategory(category: string) {
    this.category = category;
    this.categoryDisplay = false;
    if (this.searchBoxInput) {
      this.hitSearchApi();
      this.focusInput();
      this.showSuggestions();
    }
  }

  showCategory() {
    this.categoryDisplay = !this.categoryDisplay;
  }

  hideCategory() {
    this.categoryDisplay = false;
  }

  resetInput() {
    this.searchBoxInput = '';
    this.suggestions = [];
    this.suggestionsDisplay = true;
    this.focusInput();
    // ngModelChange doesn't detect change in value
    // when populated from outside, hence calling manually
    this.onChange(this.searchBoxInput);
    this.getRecentSearches();
  }
  ngOnDestroy() {
    this.searchRequest$.unsubscribe();
  }

  _categoryToSourceName(category: string) {
    if (category === ALL_LABEL) {
      return [];
    } else {
      return [category];
    }
  }
  getModelFromModelName(name: string) {
    return this.config.models.find(item => item.name === name) as IModel;
  }
  getModelsWithSuggestions() {
    const modelsWithSuggestions: {model: IModel; items: T[]}[] = [];
    const sources: string[] = [];
    this.suggestions.forEach(suggestion => {
      if (sources.indexOf(suggestion['source']) >= 0) {
        modelsWithSuggestions.every(modelWithSuggestions => {
          if (modelWithSuggestions.model.name === suggestion['source']) {
            modelWithSuggestions.items.push(suggestion);
            return false;
          }
          return true;
        });
      } else {
        const model = this.getModelFromModelName(suggestion['source']);
        modelsWithSuggestions.push({model, items: [suggestion]});
        sources.push(suggestion['source']);
      }
    });
    return modelsWithSuggestions;
  }
}

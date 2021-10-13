import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {Configuration} from '../lib-configuration';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {
  ISearchService,
  IModel,
  IRecentSearchResult,
  SEARCH_SERVICE_TOKEN,
  IRequestParameters,
  DEBOUNCE_TIME,
  DEFAULT_LIMIT,
  DEFAULT_LIMIT_TYPE,
  DEFAULT_OFFSET,
  DEFAULT_SAVE_IN_RECENTS,
  DEFAULT_ORDER,
  IReturnType,
} from '../types';

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
  suggestions: T[] = [];
  relevantSuggestions: T[] = [];
  recentSearches: IRecentSearchResult[] = [];
  category: IModel | 'All' = 'All';
  observableForSearchRequest = new Subject<{input: string; event: Event}>();
  @Input() config!: Configuration<T>;
  @Output() clicked = new EventEmitter<MouseEvent>(); //emitted when user clicks one of the suggested results (including recent search sugestions)
  @Output() searched = new EventEmitter<Event | IRecentSearchResult[]>();
  /*emitted when user makes search request (including recent search requests & requests made on change in category from dropdown)
  In case of recent search Array of recent Search request result is emitted*/

  onChange!: (value: string | undefined) => void;
  onTouched!: () => void;
  disabled = false;

  @ViewChild('searchInput') public searchInputElement!: ElementRef;

  constructor(
    @Inject(SEARCH_SERVICE_TOKEN)
    private readonly searchService: ISearchService<T>,
  ) {}

  ngOnInit(): void {
    this.getRecentSearches();
    this.observableForSearchRequest
      .pipe(debounceTime(DEBOUNCE_TIME))
      .subscribe((value: {input: string; event: Event}) => {
        this.getSuggestions(value);
      });
  }

  //ControlValueAccessor Implementation
  writeValue(value: string): void {
    this.searchBoxInput = value;
  }
  //When the value in the UI is changed, this method will invoke a callback function
  registerOnChange(fn: (value: string | undefined) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getSuggestions(eventValue: {input: string; event: Event}) {
    const order = this.config.order ?? DEFAULT_ORDER;
    let orderString = '';
    order.forEach(preference => (orderString = `${orderString}${preference} `));

    let saveInRecents = this.config.saveInRecents ?? DEFAULT_SAVE_IN_RECENTS;
    if (this.config.saveInRecents && this.config.saveInRecentsOnlyOnEnter) {
      if (
        (eventValue.event instanceof KeyboardEvent &&
          eventValue.event.key === 'Enter') ||
        (eventValue.event instanceof Event &&
          eventValue.event.type === 'change')
      ) {
        saveInRecents = true; // save in recents only on enter or change in category
      } else {
        //do not save in recent search on typing
        saveInRecents = false;
      }
    }
    //need to put default value here and not in contructor because sonar was giving code smell with definite assertion as all these parameters are optional
    const requestParameters: IRequestParameters = {
      match: eventValue.input,
      source: this.category,
      limit: this.config.limit ?? DEFAULT_LIMIT,
      limitByType: this.config.limitByType ?? DEFAULT_LIMIT_TYPE,
      order: orderString,
      offset: this.config.offset ?? DEFAULT_OFFSET,
      saveInRecents: saveInRecents,
    };

    this.searchService.searchApiRequest(requestParameters).subscribe(
      (value: T[]) => {
        this.suggestions = value;
        this.searched.emit(eventValue.event);
      },
      (_error: Error) => {
        this.suggestions = [];
      },
    );
  }
  getRecentSearches() {
    if (
      !this.config.hideRecentSearch &&
      this.searchService.recentSearchApiRequest
    ) {
      this.searchService.recentSearchApiRequest().subscribe(
        (value: IRecentSearchResult[]) => {
          this.recentSearches = value;
          this.searched.emit(this.recentSearches);
        },
        (_error: Error) => {
          this.recentSearches = [];
        },
      );
    }
  }

  //event can be KeyBoardEvent or Event of type 'change' fired on change in value of drop down for category
  hitSearchApi(event: Event) {
    //intially searchBoxInput is null somehow if we change category so keeping this null check
    if (this.searchBoxInput === null) {
      this.suggestions = [];
      return;
    }
    //this will happen only in case user searches something and then erases it, we need to update recent search
    if (this.searchBoxInput === '') {
      this.suggestions = [];
      this.getRecentSearches();
      return;
    }

    //no debounce time needed in case of searchOnlyOnEnter
    if (this.config.searchOnlyOnEnter) {
      if (
        (event instanceof KeyboardEvent && event.key === 'Enter') ||
        (event instanceof Event && event.type === 'change')
      ) {
        this.getSuggestions({input: this.searchBoxInput, event: event});
      }
      return;
    }

    //no debounce time needed in case of change in category
    if (event instanceof KeyboardEvent === false && event.type === 'change') {
      this.getSuggestions({input: this.searchBoxInput, event: event});
      return;
    }

    this.observableForSearchRequest.next({
      input: this.searchBoxInput,
      event: event,
    });
  }

  populateValue(suggestion: T, event: MouseEvent) {
    const value = suggestion[
      this.config.displayPropertyName
    ] as unknown as string; //converted to string to assign value to searchBoxInput
    this.searchBoxInput = value;
    this.suggestionsDisplay = false;
    this.onChange(this.searchBoxInput); //ngModelChange doesn't detect change in value when populated from outside, hence calling manually
    this.getSuggestions({input: this.searchBoxInput, event: event}); //need to do this to show more search options for selected suggestion - just in case user reopens search input
    this.clicked.emit(event);
  }
  populateValueRecentSearch(
    recentSearch: IRecentSearchResult,
    event: MouseEvent,
  ) {
    const value = recentSearch['match'];
    this.searchBoxInput = value;
    this.suggestionsDisplay = false;
    this.onChange(this.searchBoxInput);
    this.getSuggestions({input: this.searchBoxInput, event: event}); //need to do this to show more search options for selected suggestion - just in case user reopens search input
    this.clicked.emit(event);
  }

  fetchModelImageUrlFromSuggestion(suggestion: T) {
    const modelName = suggestion[
      'source' as unknown as keyof T
    ] as unknown as string;
    let url: string | undefined;
    this.config.models.forEach((model, i) => {
      if (model.name === modelName && model.imageUrl) {
        url = model.imageUrl;
      }
    });
    return url;
  }

  //also returns true if there are any suggestions related to the model
  getSuggestionsFromModelName(modelName: string) {
    this.relevantSuggestions = [];
    this.suggestions.forEach(suggestion => {
      const sourceModelName = suggestion[
        'source' as keyof T
      ] as unknown as string;
      if (sourceModelName === modelName)
        this.relevantSuggestions.push(suggestion);
    });
    if (this.relevantSuggestions.length) return true;
    else return false;
  }

  boldString(str: T[keyof T] | string, substr: string) {
    const strRegExp = new RegExp(substr, 'g');
    if (typeof str === 'string') {
      return str.replace(strRegExp, `<b>${substr}</b>`);
    }
    const stringToMakeBold: string = str as unknown as string;
    return stringToMakeBold.replace(strRegExp, `<b>${substr}</b>`);
  }

  hideSuggestions() {
    this.suggestionsDisplay = false;
    this.onTouched();
  }
  resetInput() {
    this.searchBoxInput = '';
    this.suggestionsDisplay = true;
    this.searchInputElement.nativeElement.focus();
    this.onChange(this.searchBoxInput); //ngModelChange doesn't detect change in value when populated from outside, hence calling manually
    this.getRecentSearches();
  }
  ngOnDestroy() {
    this.observableForSearchRequest.unsubscribe();
  }
}

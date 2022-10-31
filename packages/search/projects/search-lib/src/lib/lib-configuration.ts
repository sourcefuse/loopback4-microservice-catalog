// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IDefaultReturnType, IModel} from './types';
export class Configuration<T = IDefaultReturnType> {
  /** property to be displayed in the results */
  displayPropertyName: keyof T;
  /** list of model configuration to be render and categorize search results */
  models: IModel[];
  /** max number of results (based on limitByType option) */
  limit?: number;
  /** apply limit on individual models, or on overall results */
  limitByType?: boolean;
  /** apply a particular ordering on results */
  order?: string[];
  /** offset for results in case limit is used */
  offset?: number;
  /** save the search query in recent history */
  saveInRecents?: boolean;
  /** a placeholder to display in the search box */
  placeholder?: string;
  /** a function to generate placeholder, overrides the placeholder property */
  placeholderFunction?: (input: string, category: string) => string;
  /** categorize results on the basis of models provided */
  categorizeResults?: boolean;
  /** hides the recent search list */
  hideRecentSearch?: boolean;
  /** hide the category selection button */
  hideCategorizeButton?: boolean;
  /** save value in recent search only on enter or change in category,
   *  if false, also saved on typing */
  saveInRecentsOnlyOnEnter?: boolean;
  /** search only on enter key or when category is changed */
  searchOnlyOnEnter?: boolean;
  noResultMessage?: string;
  searchIconClass?: string;
  crossIconClass?: string;
  dropDownButtonIconClass?: string;
  recentSearchIconClass?: string;

  constructor(d: Configuration<T>) {
    checkForError(d);
    this.displayPropertyName = d.displayPropertyName;
    this.models = d.models;

    /* IRequestParameters - will be given default values before call is made in case undefined/null,
    otherwise there ! is used on which sonar gives code smell */
    this.limit = d.limit;
    this.limitByType = d.limitByType;
    this.order = d.order;
    this.offset = d.offset;
    this.saveInRecents = d.saveInRecents;

    const displayTexts = setDisplayText(d);
    this.noResultMessage = displayTexts.noResultMessage;
    this.placeholder = displayTexts.placeholder;
    this.placeholderFunction = displayTexts.placeholderFunction;

    const searchConfig = setSearchConfig(d);
    this.categorizeResults = searchConfig.categorizeResults;
    this.hideRecentSearch = searchConfig.hideRecentSearch;
    this.hideCategorizeButton = searchConfig.hideCategorizeButton;
    this.saveInRecentsOnlyOnEnter = searchConfig.saveInRecentsOnlyOnEnter;
    this.searchOnlyOnEnter = searchConfig.searchOnlyOnEnter;

    const classes = setIconClasses(d);
    this.searchIconClass = classes.searchIconClass;
    this.crossIconClass = classes.crossIconClass;
    this.dropDownButtonIconClass = classes.dropDownButtonIconClass;
    this.recentSearchIconClass = classes.recentSearchIconClass;
  }
}
function checkForError<T>(d: Configuration<T>) {
  if (
    d.categorizeResults === false &&
    (d.hideCategorizeButton === false || d.hideCategorizeButton === undefined)
  ) {
    throw new Error(
      'You must provide hideCategorizeButton:true as categorizeResults is false',
    );
  }
  if (d.saveInRecents === false && d.saveInRecentsOnlyOnEnter === true) {
    throw new Error(
      'You must provide saveInRecents:true for saveInRecentsOnlyOnEnter:true',
    );
  }
}
function setDisplayText<T>(d: Configuration<T>) {
  return {
    placeholder: d.placeholder ?? 'Search',
    noResultMessage: d.noResultMessage ?? 'No result found',
    placeholderFunction: d.placeholderFunction,
  };
}
function setSearchConfig<T>(d: Configuration<T>) {
  return {
    categorizeResults: d.categorizeResults ?? true,
    hideRecentSearch: d.hideRecentSearch ?? false,
    hideCategorizeButton: d.hideCategorizeButton ?? false,
    saveInRecentsOnlyOnEnter: d.saveInRecentsOnlyOnEnter ?? false,
    searchOnlyOnEnter: d.searchOnlyOnEnter ?? false,
  };
}
function setIconClasses<T>(d: Configuration<T>) {
  return {
    searchIconClass: d.searchIconClass ?? 'icomoon Search',
    crossIconClass: d.crossIconClass ?? 'icomoon close',
    dropDownButtonIconClass: d.dropDownButtonIconClass ?? 'icomoon arrow_down',
    recentSearchIconClass: d.recentSearchIconClass ?? 'icomoon Search',
  };
}

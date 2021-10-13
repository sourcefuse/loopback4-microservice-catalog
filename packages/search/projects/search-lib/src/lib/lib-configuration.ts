import {IDefaultReturnType, IModel} from './types';
export class Configuration<T = IDefaultReturnType> {
  displayPropertyName: keyof T;
  models: IModel[];
  limit?: number;
  limitByType?: boolean;
  order?: string[];
  offset?: number;
  saveInRecents?: boolean;
  placeholder?: string;
  categorizeResults?: boolean; //display results in list according to model name
  hideRecentSearch?: boolean; //set true if user doesn't want recent search functionality
  hideCategorizeButton?: boolean; //set true to hide the dropdown button which allows to search by category
  saveInRecentsOnlyOnEnter?: boolean; //save values in recent search only on enter or change in category. If false also saved on typing
  searchOnlyOnEnter?: boolean; //make search request only when enter key is pressed or category is changed

  constructor(d: Configuration<T>) {
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
    this.displayPropertyName = d.displayPropertyName;
    this.models = d.models;

    this.placeholder = d.placeholder ?? 'Search';
    //IRequestParameters - will be given default values before call is made in case undefined/null, otherwise there ! is used on which sonar gives code smell
    this.limit = d.limit;
    this.limitByType = d.limitByType;
    this.order = d.order;
    this.offset = d.offset;
    this.saveInRecents = d.saveInRecents;

    this.categorizeResults = d.categorizeResults ?? true;
    this.hideRecentSearch = d.hideRecentSearch ?? false;
    this.hideCategorizeButton = d.hideCategorizeButton ?? false;
    this.saveInRecentsOnlyOnEnter = d.saveInRecentsOnlyOnEnter ?? false;
    this.searchOnlyOnEnter = d.searchOnlyOnEnter ?? false;
  }
}

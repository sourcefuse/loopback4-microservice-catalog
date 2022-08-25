import {Configuration} from '../../lib-configuration';
import {
  IModel,
  IReturnType,
  ISearchQuery,
  ISearchService,
  TypeEvent,
} from '../../types';
export const Imodel: IModel = {
  name: 'ToDo',
  displayName: 'List',
};
export const IReturnMockValue: IReturnType[] = [
  {
    rank: 1,
    source: '',
  },
];
export interface MockIReturnType {
  rank: number;
  source: string;
}
export const mockIModel: IModel = {
  name: 'User',
  displayName: 'Users',
};
export const mockConfig: Configuration<MockIReturnType> = {
  displayPropertyName: 'source',
  models: [
    {
      name: 'ToDo',
      displayName: 'List',
      imageUrl: 'https://picsum.photos/id/1/50',
    },
    {
      name: 'User',
      displayName: 'Users',
    },
  ],
  limit: 20,
  limitByType: false,
  order: [`name ASC`, `description DESC`],
  offset: 0,
  saveInRecents: true,
  placeholder: '',
  //placeholderFunction: (input: string, category: string) =>{},
  categorizeResults: true,
  hideRecentSearch: false,
  hideCategorizeButton: false,
  saveInRecentsOnlyOnEnter: true,
  searchOnlyOnEnter: true,
  noResultMessage: '',
  searchIconClass: '',
  crossIconClass: '',
  dropDownButtonIconClass: '',
  recentSearchIconClass: '',
};
export const ISearchMockValue: ISearchQuery[] = [
  {
    match: 'user',
    limit: 10,
    order: '',
    limitByType: false,
    offset: 2,
    sources: [],
  },
];
export class MockSearchService implements ISearchService<IReturnType> {
  searchApiRequest = jasmine.createSpy();
  recentSearchApiRequest = jasmine.createSpy();
}

export const mockCategory = ['User'];
export function mockFunction(): void {
  // This is intentional
}

export function mockOnChange(_mockValue: string | undefined): void {
  // This is intentional
}
export const mockSuggestionUrl: IReturnType = {
  rank: 1,
  source: 'ToDo',
};
export const mockSuggestion: IReturnType = {
  rank: 1,
  source: 'User',
};
export const mockSuggestionForModel: IReturnType = {
  rank: 1,
  source: '',
};
export const mockEvent: TypeEvent = {
  input: 'User',
};
export const url = 'https://picsum.photos/id/1/50';
export const value = '';
export const emittedValue = {
  input: 'User',
  event: new KeyboardEvent('click', {
    key: 'Enter',
  }),
};
export const recentSearch: ISearchQuery = {
  match: 'user',
  limit: 10,
  order: '',
  limitByType: false,
  offset: 2,
  sources: [],
};
export function mockDisabledState(_disable: boolean): void {
  // This is intentional
}
export const mockNoEvent: TypeEvent = {
  input: '',
};

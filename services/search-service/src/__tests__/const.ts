import {TestSearched, TestSearchedCustom, TestSearchModel} from './fixtures';
import {SearchableModelsList} from '../types';

export const testModelList: SearchableModelsList<TestSearchModel> = [
  TestSearched,
  {
    model: TestSearchedCustom,
    columns: {
      description: 'about',
      name: 'identifier',
    },
  },
];

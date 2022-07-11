// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  TestSearched,
  TestSearchedCustom,
  TestSearchModel,
  TestSearchedCustomWithIdentifier,
} from './fixtures';
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

export const testModelListWithIdentifier: SearchableModelsList<TestSearchModel> =
  [
    TestSearched,
    {
      model: TestSearchedCustom,
      columns: {
        description: 'about',
        name: 'identifier',
      },
    },
    {
      model: TestSearchedCustomWithIdentifier,
      identifier: 'CustomIdentifier',
      columns: {
        description: 'about',
        name: 'identifier',
      },
    },
  ];

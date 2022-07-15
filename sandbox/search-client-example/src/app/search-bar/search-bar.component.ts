// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component} from '@angular/core';
import {Configuration, IDefaultReturnType} from '@sourceloop/search-client';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  config: Configuration<IDefaultReturnType>;
  value!: string;
  constructor() {
    this.config = new Configuration<IDefaultReturnType>({
      displayPropertyName: 'name',
      models: [
        {
          name: 'ToDo',
          displayName: 'List',
          imageUrl: 'https://picsum.photos/id/1000/50',
        },
        {
          name: 'User',
          displayName: 'Users',
          imageUrl: 'https://picsum.photos/id/1/50',
        },
      ],
      order: [`name ASC`, `description DESC`],
      hideCategorizeButton: false,
      placeholder: 'Search Programs, Projects or Dashboards',
      categorizeResults: true,
      saveInRecents: true,
      limit: 4,
    });
  }
}

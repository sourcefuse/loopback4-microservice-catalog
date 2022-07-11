// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component} from '@angular/core';
import {LocalStorageService} from '../local-storage.service';

@Component({
  selector: 'app-token-input',
  templateUrl: './token-input.component.html',
})
export class TokenInputComponent {
  token: string;
  tokenSet: boolean;
  constructor(private readonly localStorageService: LocalStorageService) {
    this.token = '';
    this.tokenSet = false;
  }
  onSubmit() {
    this.localStorageService.set('token', this.token);
    this.tokenSet = true;
    this.token = '';
  }
}

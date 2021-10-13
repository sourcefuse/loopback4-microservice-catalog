import {NgModule} from '@angular/core';
import {SearchComponent} from './search/search.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, FormsModule, HttpClientModule],
  exports: [SearchComponent],
})
export class SearchLibModule {}

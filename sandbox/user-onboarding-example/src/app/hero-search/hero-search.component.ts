// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component, OnInit} from '@angular/core';

import {Observable, Subject} from 'rxjs';

import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import {Hero} from '../hero';
import {HeroService} from '../hero.service';
import {TourService} from '../tour.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss'],
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private readonly searchTerms = new Subject<string>();
  disablePointerEvents: boolean;

  constructor(
    private readonly heroService: HeroService,
    private readonly tourService: TourService,
  ) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    const dTime = 300;
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term

      debounceTime(dTime),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
    this.tourService.tourRunning$.subscribe(tourState => {
      this.disablePointerEvents = tourState;
    });
  }
}

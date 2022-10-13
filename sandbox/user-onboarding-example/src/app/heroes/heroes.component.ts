// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component, OnInit} from '@angular/core';

import {Hero} from '../hero';
import {HeroService} from '../hero.service';
import {TourId} from '../tour.constant';
import {TourService} from '../tour.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];
  disablePointerEvents: boolean;
  constructor(
    private readonly heroService: HeroService,
    private readonly tourService: TourService,
  ) {}

  ngOnInit(): void {
    this.getHeroes();
    this.tourService.runTour(TourId.DevTour);
    this.tourService.tourRunning$.subscribe(tourState => {
      this.disablePointerEvents = tourState;
    });
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => (this.heroes = heroes));
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.heroService.addHero({name} as Hero).subscribe(hero => {
      this.heroes.push(hero);
    });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}

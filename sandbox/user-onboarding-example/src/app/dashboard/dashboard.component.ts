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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];
  disablePointerEvents: boolean;
  constructor(
    private readonly heroService: HeroService,
    private readonly tourService: TourService,
  ) {}

  ngOnInit(): void {
    this.getHeroes();
    this.tourService.runTour(TourId.DashboardTour);
    this.tourService.tourRunning$.subscribe(tourState => {
      this.disablePointerEvents = tourState;
    });
  }

  getHeroes(): void {
    const lowerLimit = 1;
    const upperLimit = 5;
    this.heroService
      .getHeroes()
      .subscribe(
        heroes => (this.heroes = heroes.slice(lowerLimit, upperLimit)),
      );
  }
}

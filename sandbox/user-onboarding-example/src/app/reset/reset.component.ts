import {Component} from '@angular/core';
import {TourService} from '../tour.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
})
export class ResetComponent {
  constructor(private readonly tourService: TourService) {}

  resetTour() {
    this.tourService.resetAllTours();
  }
}

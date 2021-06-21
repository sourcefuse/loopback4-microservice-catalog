import { TourStoreServiceService } from './tour-store-service.service';
import { Injectable } from '@angular/core';
import Shepherd from 'shepherd.js';
import { Tour } from '../models';
import {
  Router,
  NavigationEnd,
  Event as NavigationEvent,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TourServiceService {
  currentStep;
  public readonly nextRouteMap = new Map<string, string>();
  public readonly prevRouteMap = new Map<string, string>();
  constructor(
    private readonly tourStoreService: TourStoreServiceService,
    private readonly router: Router
  ) {}

  private waitForElement(querySelector, timeout = 0) {
    const startTime = new Date().getTime();
    return new Promise<void>((resolve, reject) => {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        if (document.querySelector(querySelector)) {
          console.log(document.querySelector(querySelector));
          clearInterval(timer);
          resolve();
        } else if (timeout && now - startTime >= timeout) {
          clearInterval(timer);
          reject();
        }
      }, 100);
    });
  }

  private triggerTour(tourInstance: Tour): void {
    let removedSteps;
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true,
        },
        classes: 'class-1 class-2',
        scrollTo: { behavior: 'smooth', block: 'center' },
      },
    });
    const sessionId = this.tourStoreService.getSessionId();
    this.tourStoreService
      .loadState({ tourId: tourInstance.tourId, sessionId })
      .subscribe(currentStep => {
        if (currentStep) {
          let f = true;
          removedSteps = tourInstance.tourSteps.filter(e => {
            if (e.id === currentStep.step || !f) {
              f = false;
            }
            return f;
          });
          let flag = false;
          tourInstance.tourSteps = tourInstance.tourSteps.filter(e => {
            if (e.id === currentStep.step || flag) {
              flag = true;
            }
            return flag;
          });
        } else {
          this.tourStoreService.generateSessionId();
        }
        tourInstance.tourSteps.forEach(e => {
          e.buttons.forEach(b => {
            const key = b.key;
            const func = this.tourStoreService.getFnByKey(key);
            const wrapperNext = () => {
              this.router.navigate([e.nextRoute]);
              this.router.events.subscribe((event: NavigationEvent) => {
                if (event instanceof NavigationEnd) {
                  this.waitForElement(e.attachTo.element, 0)
                    .then(function () {
                      tour.cancel();
                      tour.next();
                    })
                    .catch(e => {
                      console.log(e);
                    });
                }
              });
            };
            const wrapperPrev = () => {
              this.router.navigate([e.prevRoute]);
              this.router.events.subscribe((event: NavigationEvent) => {
                if (event instanceof NavigationEnd) {
                  this.waitForElement(e.attachTo.element, 0)
                    .then(function () {
                      tour.cancel();
                      tour.back();
                    })
                    .catch(e => {
                      console.log(e);
                    });
                }
              });
            };
            if (b.key === 'prevAction') {
              if (e.prevRoute === e.currentRoute) {
                b.action = func;
              } else {
                b.action = wrapperPrev;
              }
            } else if (b.key === 'nextAction') {
              if (e.currentRoute === e.nextRoute) {
                b.action = func;
              } else {
                b.action = wrapperNext;
              }
            } else {
              b.action = func;
            }
          });
        });
        for (const s of tourInstance.tourSteps) {
          this.nextRouteMap.set(s.id, s.nextRoute);
        }
        for (const s of tourInstance.tourSteps) {
          this.prevRouteMap.set(s.id, s.prevRoute);
        }
        tour.addSteps(tourInstance.tourSteps);
        tour.start();
        if (removedSteps !== undefined) {
          console.log(removedSteps);

          removedSteps.forEach(e => {
            e.buttons.forEach(b => {
              const k = b.key;
              const func = this.tourStoreService.getFnByKey(k);
              const wrapperNext = () => {
                this.router.navigate([e.nextRoute]);
                this.router.events.subscribe((event: NavigationEvent) => {
                  if (event instanceof NavigationEnd) {
                    this.waitForElement(e.attachTo.element, 0)
                      .then(function () {
                        tour.cancel();
                        tour.next();
                      })
                      .catch(e => {
                        console.log(e);
                      });
                  }
                });
              };
              const wrapperPrev = () => {
                this.router.navigate([e.prevRoute]);
                this.router.events.subscribe((event: NavigationEvent) => {
                  if (event instanceof NavigationEnd) {
                    this.waitForElement(e.attachTo.element, 0)
                      .then(function () {
                        tour.cancel();
                        tour.back();
                      })
                      .catch(e => {
                        console.log(e);
                      });
                  }
                });
              };
              if (b.key === 'prevAction') {
                if (e.prevRoute === e.currentRoute) {
                  b.action = func;
                } else {
                  b.action = wrapperPrev;
                }
              } else if (b.key === 'nextAction') {
                if (e.currentRoute === e.nextRoute) {
                  b.action = func;
                } else {
                  b.action = wrapperNext;
                }
              } else {
                b.action = func;
              }
            });
          });
          tour.addSteps(removedSteps);
          for (const step of removedSteps) {
            tour.steps.splice(0, 0, tour.steps.pop());
          }
        }
        tour.on('show', () => {
          this.tourStoreService.saveState({
            tourId: tourInstance.tourId,
            state: {
              sessionId: this.tourStoreService.getSessionId(),
              step: tour.getCurrentStep().id,
            },
          });
        });
      });
  }

  public run(tourId: string): void {
    this.tourStoreService.loadTour({ tourId }).subscribe(tourInstance => {
      if (tourInstance) {
        this.triggerTour(tourInstance);
      } else {
        throw new Error('Tour does not exist');
      }
    });
  }
}

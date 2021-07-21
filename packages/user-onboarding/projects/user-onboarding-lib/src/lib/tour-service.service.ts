import { TourStoreServiceService } from './tour-store-service.service';
import { Injectable } from '@angular/core';
import Shepherd from 'shepherd.js';
import { Tour, TourButton, TourStep } from '../models';
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
  private readonly interval = 100;
  private readonly tour = new Shepherd.Tour({
    defaultStepOptions: {
      cancelIcon: {
        enabled: true,
      },
      classes: 'class-1 class-2',
      scrollTo: { behavior: 'smooth', block: 'center' },
    },
  });
  constructor(
    private readonly tourStoreService: TourStoreServiceService,
    private readonly router: Router
  ) { }

  private addRemovedSteps(removedSteps): void {
    const count = removedSteps.length;
    for (let i = 0; i < count; i++) {
      this.tour.steps.splice(0, 0, this.tour.steps.pop());
    }
  }

  private actionAssignment(
    e: TourStep,
    b: TourButton,
    wrapperNormalNext,
    wrapperNormalPrev,
    wrapperNext,
    wrapperPrev,
    func
  ): void {
    if (b.key === 'prevAction') {
      b.action =
        e.prevRoute === e.currentRoute ? wrapperNormalPrev : wrapperPrev;
    } else if (b.key === 'nextAction') {
      b.action =
        e.nextRoute === e.currentRoute ? wrapperNormalNext : wrapperNext;
    } else {
      b.action = func;
    }
  }

  private navigationCheckNext(event: NavigationEvent, e: TourStep): void {
    if (event instanceof NavigationEnd) {
      this.waitForElement(e.attachTo.element, 0)
        .then(() => {
          this.tour.cancel();
          this.tour.next();
        })
        .catch(() => {
          throw new Error('Error detected in loading');
        });
    }
  }

  private navigationCheckBack(event: NavigationEvent, e: TourStep): void {
    if (event instanceof NavigationEnd) {
      this.waitForElement(e.attachTo.element, 0)
        .then(() => {
          this.tour.cancel();
          this.tour.back();
        })
        .catch(() => {
          throw new Error('Error detected in loading');
        });
    }
  }

  private waitForElement(querySelector, timeout = 0): Promise<void> {
    const startTime = new Date().getTime();
    return new Promise<void>((resolve, reject) => {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        if (document.querySelector(querySelector)) {
          clearInterval(timer);
          resolve();
        } else if (timeout && now - startTime >= timeout) {
          clearInterval(timer);
          reject();
        } else {// do nothing
        }
      }, this.interval);
    });
  }

  private triggerTour(tourInstance: Tour): void {
    let removedSteps;
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
              this.tourStoreService.saveState({
                tourId: tourInstance.tourId,
                state: {
                  sessionId: this.tourStoreService.getSessionId(),
                  step: e.nextStepId,
                },
              });
              this.router.navigate([e.nextRoute]);
              this.router.events.subscribe((event: NavigationEvent) => {
                this.navigationCheckNext(event, e);
              });
            };
            const wrapperPrev = () => {
              this.tourStoreService.saveState({
                tourId: tourInstance.tourId,
                state: {
                  sessionId: this.tourStoreService.getSessionId(),
                  step: e.prevStepId,
                },
              });
              this.router.navigate([e.prevRoute]);
              this.router.events.subscribe((event: NavigationEvent) => {
                this.navigationCheckBack(event, e);
              });
            };
            const wrapperNormalNext = () => {
              this.tourStoreService.saveState({
                tourId: tourInstance.tourId,
                state: {
                  sessionId: this.tourStoreService.getSessionId(),
                  step: e.nextStepId,
                },
              });
              this.tour.cancel();
              this.tour.next();
            };
            const wrapperNormalPrev = () => {
              this.tourStoreService.saveState({
                tourId: tourInstance.tourId,
                state: {
                  sessionId: this.tourStoreService.getSessionId(),
                  step: e.prevStepId,
                },
              });
              this.tour.cancel();
              this.tour.back();
            };
            this.actionAssignment(
              e,
              b,
              wrapperNormalNext,
              wrapperNormalPrev,
              wrapperNext,
              wrapperPrev,
              func
            );
          });
        });
        this.tour.addSteps(tourInstance.tourSteps);
        this.tour.start();
        if (removedSteps !== undefined) {
          removedSteps.forEach(er => {
            er.buttons.forEach(br => {
              const k = br.key;
              const funcRemoved = this.tourStoreService.getFnByKey(k);
              const wrapperNextRemoved = () => {
                this.tourStoreService.saveState({
                  tourId: tourInstance.tourId,
                  state: {
                    sessionId: this.tourStoreService.getSessionId(),
                    step: er.nextStepId,
                  },
                });
                this.router.navigate([er.nextRoute]);
                this.router.events.subscribe((event: NavigationEvent) => {
                  this.navigationCheckNext(event, er);
                });
              };
              const wrapperPrevRemoved = () => {
                this.tourStoreService.saveState({
                  tourId: tourInstance.tourId,
                  state: {
                    sessionId: this.tourStoreService.getSessionId(),
                    step: er.prevStepId,
                  },
                });
                this.router.navigate([er.prevRoute]);
                this.router.events.subscribe((event: NavigationEvent) => {
                  this.navigationCheckBack(event, er);
                });
              };
              const wrapperNormalNextRemoved = () => {
                this.tourStoreService.saveState({
                  tourId: tourInstance.tourId,
                  state: {
                    sessionId: this.tourStoreService.getSessionId(),
                    step: er.nextStepId,
                  },
                });
                this.tour.cancel();
                this.tour.next();
              };
              const wrapperNormalPrevRemoved = () => {
                this.tourStoreService.saveState({
                  tourId: tourInstance.tourId,
                  state: {
                    sessionId: this.tourStoreService.getSessionId(),
                    step: er.prevStepId,
                  },
                });
                this.tour.cancel();
                this.tour.back();
              };
              this.actionAssignment(
                er,
                br,
                wrapperNormalNextRemoved,
                wrapperNormalPrevRemoved,
                wrapperNextRemoved,
                wrapperPrevRemoved,
                funcRemoved
              );
            });
          });
          this.tour.addSteps(removedSteps);
          this.addRemovedSteps(removedSteps);
        }
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

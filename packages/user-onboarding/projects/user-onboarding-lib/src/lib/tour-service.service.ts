import {TourStoreServiceService} from './tour-store-service.service';
import {Injectable} from '@angular/core';
import Shepherd from 'shepherd.js';
import {
  Tour,
  TourButton,
  TourStep,
  TourState,
  filterFunction,
  Props,
  Status,
} from '../models';
import {Router, NavigationEnd, Event as NavigationEvent} from '@angular/router';
import {interval, Subject} from 'rxjs';
import {filter, map, take, takeWhile, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TourServiceService {
  private readonly tourComplete = new Subject<{
    index: number;
    tour: Shepherd.Tour;
    tourId: string;
  }>();
  tourComplete$ = this.tourComplete.asObservable();
  private readonly interval = 100;

  private tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: {
        enabled: true,
      },
      classes: 'class-1 class-2',
      scrollTo: {behavior: 'smooth', block: 'center'},
    },
  });

  constructor(
    private readonly tourStoreService: TourStoreServiceService,
    private readonly router: Router,
  ) {}

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
    func,
    tourId: string,
    props: Props,
  ): void {
    if (b.key === 'prevAction') {
      b.action =
        e.prevRoute === e.currentRoute ? wrapperNormalPrev : wrapperPrev;
    } else if (b.key === 'nextAction') {
      b.action =
        e.nextRoute === e.currentRoute ? wrapperNormalNext : wrapperNext;
    } else {
      b.action = func.bind({tour: this.tour, tourId, props});
    }
  }

  private navigationCheckNext(event: NavigationEvent, e: TourStep): void {
    if (event instanceof NavigationEnd && event.url === e.currentRoute) {
      this.waitForElement(e.attachTo.element, 0)
        .then(() => {
          this.tour.next();
        })
        .catch(() => {
          throw new Error('Error detected in loading');
        });
    }
  }

  private navigationCheckBack(event: NavigationEvent, e: TourStep): void {
    if (event instanceof NavigationEnd && event.url === e.currentRoute) {
      this.waitForElement(e.attachTo.element, 0)
        .then(() => {
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
        } else {
          // do nothing
        }
      }, this.interval);
    });
  }

  private triggerTour(tourInstance: Tour, props: Props): void {
    let removedSteps;
    const sessionId = this.tourStoreService.getSessionId();
    if (!sessionId) {
      this.tourStoreService.generateSessionId();
    }
    this.tourStoreService
      .loadState({tourId: tourInstance.tourId, sessionId})
      .subscribe(tourState => {
        if (tourState && Object.keys(tourState).length) {
          removedSteps = this.getRemovedSteps(
            tourInstance.tourSteps,
            tourState,
          );
          tourInstance.tourSteps = this.getTourSteps(
            tourInstance.tourSteps,
            tourState,
          );
        } else {
          tourState = {
            sessionId: this.tourStoreService.getSessionId(),
            step: tourInstance.tourSteps[0].id,
            props,
            status: Status.InProgress,
          };
          this.tourStoreService
            .saveState({
              tourId: tourInstance.tourId,
              state: tourState,
            })
            .subscribe();
        }
        tourInstance.tourSteps.forEach(e => {
          e.buttons.forEach(b => {
            const key = b.key;
            const func = this.tourStoreService.getFnByKey(key);
            const wrapperNext = () => {
              this.tourStoreService
                .saveState({
                  tourId: tourInstance.tourId,
                  state: {
                    sessionId: this.tourStoreService.getSessionId(),
                    step: e.nextStepId,
                    props: tourState.props,
                    status: this.getStatus(e, tourInstance.tourSteps),
                  },
                })
                .subscribe();
              this.router.navigate([e.nextRoute]);
              this.router.events.subscribe((event: NavigationEvent) => {
                const nextStep = tourInstance.tourSteps.filter(
                  ts => ts.id === e.nextStepId,
                )[0];
                this.navigationCheckNext(event, nextStep);
              });
            };
            const wrapperPrev = () => {
              this.tourStoreService
                .saveState({
                  tourId: tourInstance.tourId,
                  state: {
                    sessionId: this.tourStoreService.getSessionId(),
                    step: e.prevStepId,
                    props: tourState.props,
                    status: Status.InProgress,
                  },
                })
                .subscribe();
              this.router.navigate([e.prevRoute]);
              this.router.events.subscribe((event: NavigationEvent) => {
                const prevStep = tourInstance.tourSteps.filter(
                  ts => ts.id === e.prevStepId,
                )[0];
                this.navigationCheckBack(event, prevStep);
              });
            };
            const wrapperNormalNext = () => {
              this.tourStoreService
                .saveState({
                  tourId: tourInstance.tourId,
                  state: {
                    sessionId: this.tourStoreService.getSessionId(),
                    step: e.nextStepId,
                    props: tourState.props,
                    status: this.getStatus(e, tourInstance.tourSteps),
                  },
                })
                .subscribe();
              this.tour.next();
            };
            const wrapperNormalPrev = () => {
              this.tourStoreService
                .saveState({
                  tourId: tourInstance.tourId,
                  state: {
                    sessionId: this.tourStoreService.getSessionId(),
                    step: e.prevStepId,
                    props: tourState.props,
                    status: Status.InProgress,
                  },
                })
                .subscribe();
              this.tour.back();
            };
            this.actionAssignment(
              e,
              b,
              wrapperNormalNext,
              wrapperNormalPrev,
              wrapperNext,
              wrapperPrev,
              func,
              tourInstance.tourId,
              tourState.props,
            );
          });
        });
        const originalSteps = Object.assign([], tourInstance.tourSteps);
        let element;
        this.tour.addSteps(tourInstance.tourSteps);
        const waitTime = 2000;
        interval(1)
          .pipe(
            tap(_count => {
              element = this.checkFirstElement(originalSteps);
            }),
            takeWhile(count => count < waitTime),
            filter(_count => element),
            take(1),
            map(_count => element),
          )
          .subscribe((el: Element) => {
            el.scrollIntoView(true);
            this.tour.start();
            if (removedSteps !== undefined) {
              removedSteps.forEach(er => {
                er.buttons.forEach(br => {
                  const k = br.key;
                  const funcRemoved = this.tourStoreService.getFnByKey(k);
                  const wrapperNextRemoved = () => {
                    this.tourStoreService
                      .saveState({
                        tourId: tourInstance.tourId,
                        state: {
                          sessionId: this.tourStoreService.getSessionId(),
                          step: er.nextStepId,
                          props: tourState.props,
                          status: this.getStatus(er, tourInstance.tourSteps),
                        },
                      })
                      .subscribe();
                    this.router.navigate([er.nextRoute]);
                    this.router.events.subscribe((event: NavigationEvent) => {
                      this.navigationCheckNext(event, er);
                    });
                  };
                  const wrapperPrevRemoved = () => {
                    this.tourStoreService
                      .saveState({
                        tourId: tourInstance.tourId,
                        state: {
                          sessionId: this.tourStoreService.getSessionId(),
                          step: er.prevStepId,
                          props: tourState.props,
                          status: Status.InProgress,
                        },
                      })
                      .subscribe();
                    this.router.navigate([er.prevRoute]);
                    this.router.events.subscribe((event: NavigationEvent) => {
                      this.navigationCheckBack(event, er);
                    });
                  };
                  const wrapperNormalNextRemoved = () => {
                    this.tourStoreService
                      .saveState({
                        tourId: tourInstance.tourId,
                        state: {
                          sessionId: this.tourStoreService.getSessionId(),
                          step: er.nextStepId,
                          props: tourState.props,
                          status: this.getStatus(er, tourInstance.tourSteps),
                        },
                      })
                      .subscribe();
                    this.tour.next();
                  };
                  const wrapperNormalPrevRemoved = () => {
                    this.tourStoreService
                      .saveState({
                        tourId: tourInstance.tourId,
                        state: {
                          sessionId: this.tourStoreService.getSessionId(),
                          step: er.prevStepId,
                          props: tourState.props,
                          status: Status.InProgress,
                        },
                      })
                      .subscribe();
                    this.tour.back();
                  };
                  this.actionAssignment(
                    er,
                    br,
                    wrapperNormalNextRemoved,
                    wrapperNormalPrevRemoved,
                    wrapperNextRemoved,
                    wrapperPrevRemoved,
                    funcRemoved,
                    tourInstance.tourId,
                    tourState.props,
                  );
                });
              });
              this.tour.addSteps(removedSteps);
              this.addRemovedSteps(removedSteps);
            }
          });
      });
  }
  public run(
    tourId: string,
    params?: {[key: string]: string},
    props?: Props,
    filterFn?: filterFunction,
  ): void {
    this.tourStoreService
      .loadTour({
        tourId,
        sessionId: this.tourStoreService.getSessionId(),
      })
      .subscribe(tourInstance => {
        if (tourInstance && tourInstance.tourSteps.length > 0) {
          let steps = JSON.stringify(tourInstance.tourSteps);
          Object.keys(params).forEach(key => {
            steps = steps.replace(
              new RegExp(`\\{\\{${key}\\}\\}`),
              params[key],
            );
          });
          tourInstance.tourSteps = JSON.parse(steps);
          this.tour = new Shepherd.Tour({
            useModalOverlay: true,
            defaultStepOptions: {
              cancelIcon: {
                enabled: true,
              },
              classes: 'class-1 class-2',
              scrollTo: {behavior: 'smooth', block: 'center'},
            },
          });
          this.tour.on(
            'complete',
            (event: {index: number; tour: Shepherd.Tour; tourId: string}) => {
              event.tourId = tourInstance.tourId;
              this.tourComplete.next(event);
            },
          );
          if (filterFn) {
            tourInstance.tourSteps = filterFn(tourInstance.tourSteps);
          }
          tourInstance.tourSteps[0].attachTo.scrollTo = false;
          this.triggerTour(tourInstance, props);
        } else {
          // do nothing
        }
      });
  }
  private checkFirstElement(tourSteps: TourStep[]) {
    const firstStep = tourSteps[0];
    if (firstStep) {
      switch (firstStep.attachTo.type) {
        case 'string':
          return document.querySelector(firstStep.attachTo.element);

        case 'element':
          return firstStep.attachTo.element;

        case 'function':
          const fn = this.tourStoreService.getFnByKey(
            firstStep.attachTo.element,
          );
          return fn();

        default:
          return false;
      }
    } else {
      return false;
    }
  }
  private getRemovedSteps(tourSteps: TourStep[], tourState: TourState) {
    let f = true;
    return tourSteps.filter(e => {
      if (e.id === tourState.step || !f) {
        f = false;
      }
      return f;
    });
  }
  private getTourSteps(tourSteps: TourStep[], tourState: TourState) {
    let flag = false;
    return tourSteps.filter(e => {
      if (e.id === tourState.step || flag) {
        flag = true;
      }
      return flag;
    });
  }

  private getStatus(currentTourStep: TourStep, tourSteps: TourStep[]) {
    const lastId = tourSteps[tourSteps.length - 1].id;
    if (currentTourStep.id === lastId) {
      return Status.Complete;
    } else {
      return Status.InProgress;
    }
  }
}

import {TourStoreServiceService} from './tour-store-service.service';
import {Injectable} from '@angular/core';
import Shepherd from 'shepherd.js';
import {
  Tour,
  TourButton,
  TourStep,
  TourState,
  FilterFunction,
  Props,
  Status,
  TourStepChange,
  TourComplete,
} from '../models';
import {Router, NavigationEnd, Event as NavigationEvent} from '@angular/router';
import {Subject} from 'rxjs';
import {DEFAULT_MAX_WAIT_TIME, INTERVAL} from '../models/constants';

@Injectable({
  providedIn: 'root',
})
export class TourServiceService {
  private readonly tourComplete = new Subject<TourComplete>();
  tourComplete$ = this.tourComplete.asObservable();
  private readonly tourStepChange = new Subject<TourStepChange>();
  tourStepChange$ = this.tourStepChange.asObservable();
  private readonly interval = INTERVAL;
  private _maxWaitTime = DEFAULT_MAX_WAIT_TIME;
  private readonly tourFailed = new Subject<{
    tourId: string;
    message: string;
  }>();
  tourFailed$ = this.tourFailed.asObservable();

  private tour: Shepherd.Tour;

  constructor(
    private readonly tourStoreService: TourStoreServiceService,
    private readonly router: Router,
  ) {}

  public set maxWaitTime(maxTime: number) {
    if (maxTime > 0) {
      this._maxWaitTime = maxTime;
    }
  }

  public get maxWaitTime() {
    return this._maxWaitTime;
  }
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

  private navigationCheckNext(
    event: NavigationEvent,
    e: TourStep,
    tourInstance: Tour,
    currentStepId: string,
    previousStepId: string,
  ): void {
    if (event instanceof NavigationEnd && event.url === e.currentRoute) {
      this.waitForElement(e, tourInstance.tourId)
        .then(() => {
          this.tour.next();
          this.tourStepChange.next({
            tourId: tourInstance.tourId,
            currentStepId,
            previousStepId,
            moveForward: true,
          });
          this.pauseAllVideos();
        })
        .catch(err => {
          this.tourFailed.next(err);
        });
    }
  }

  private navigationCheckBack(
    event: NavigationEvent,
    e: TourStep,
    tourInstance: Tour,
    currentStepId: string,
    previousStepId: string,
  ): void {
    if (event instanceof NavigationEnd && event.url === e.currentRoute) {
      this.waitForElement(e, tourInstance.tourId)
        .then(() => {
          this.tour.back();
          this.tourStepChange.next({
            tourId: tourInstance.tourId,
            currentStepId,
            previousStepId,
            moveForward: false,
          });
          this.pauseAllVideos();
        })
        .catch(err => {
          this.tourFailed.next(err);
        });
    }
  }

  private waitForElement(tourStep: TourStep, tourId: string): Promise<Element> {
    const startTime = new Date().getTime();
    return new Promise<Element>((resolve, reject) => {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const element = this.checkElement(tourStep.attachTo);
        if (element) {
          clearInterval(timer);
          resolve(element);
        } else if (now - startTime >= this._maxWaitTime) {
          clearInterval(timer);
          reject({tourId, message: `Error in loading tour`});
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
                this.navigationCheckNext(
                  event,
                  nextStep,
                  tourInstance,
                  e.nextStepId,
                  e.id,
                );
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

                this.navigationCheckBack(
                  event,
                  prevStep,
                  tourInstance,
                  e.prevStepId,
                  e.id,
                );
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
              this.tourStepChange.next({
                tourId: tourInstance.tourId,
                currentStepId: e.nextStepId,
                previousStepId: e.id,
                moveForward: true,
              });
              this.pauseAllVideos();
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
              this.tourStepChange.next({
                tourId: tourInstance.tourId,
                currentStepId: e.prevStepId,
                previousStepId: e.id,
                moveForward: true,
              });
              this.pauseAllVideos();
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
        this.tour.addSteps(tourInstance.tourSteps);
        this.waitForElement(originalSteps[0], tourInstance.tourId).then(
          element => {
            element.scrollIntoView(true);
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
                      this.navigationCheckNext(
                        event,
                        er,
                        tourInstance,
                        er.nextStepId,
                        er.id,
                      );
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
                      this.navigationCheckBack(
                        event,
                        er,
                        tourInstance,
                        er.prevStepId,
                        er.id,
                      );
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
                    this.tourStepChange.next({
                      tourId: tourInstance.tourId,
                      currentStepId: er.nextStepId,
                      previousStepId: er.id,
                      moveForward: true,
                    });
                    this.pauseAllVideos();
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
                    this.tourStepChange.next({
                      tourId: tourInstance.tourId,
                      currentStepId: er.nextStepId,
                      previousStepId: er.id,
                      moveForward: false,
                    });
                    this.pauseAllVideos();
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
          },
          err => {
            this.tourFailed.next(err);
          },
        );
      });
  }
  public run(
    tourId: string,
    params?: {[key: string]: string},
    props?: Props,
    filterFn?: FilterFunction,
  ): void {
    this.tourStoreService
      .loadTour({
        tourId,
        sessionId: this.tourStoreService.getSessionId(),
      })
      .subscribe(tourInstance => {
        if (tourInstance && tourInstance.tourSteps.length > 0) {
          if (params) {
            let steps = JSON.stringify(tourInstance.tourSteps);

            Object.keys(params).forEach(key => {
              steps = steps.replace(
                new RegExp(`\\{\\{${key}\\}\\}`),
                params[key],
              );
            });
            tourInstance.tourSteps = JSON.parse(steps);
          }
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
  private checkElement(attachTo: TourStep['attachTo']) {
    switch (attachTo.type) {
      case 'string':
        return document.querySelector(attachTo.element as string);

      case 'element':
        return attachTo.element as Element;

      case 'function':
        const fn = this.tourStoreService.getFnByKey(attachTo.element);
        return fn() as Element;

      default:
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
  private pauseAllVideos() {
    document.querySelectorAll('video').forEach(vid => vid.pause());
  }
}

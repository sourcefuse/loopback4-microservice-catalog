import { ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, ɵɵdefineComponent, ɵɵelementStart, ɵɵtext, ɵɵelementEnd, Component, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';

class UserOnboardingLibService {
    constructor() { }
}
UserOnboardingLibService.ɵfac = function UserOnboardingLibService_Factory(t) { return new (t || UserOnboardingLibService)(); };
UserOnboardingLibService.ɵprov = ɵɵdefineInjectable({ token: UserOnboardingLibService, factory: UserOnboardingLibService.ɵfac, providedIn: 'root' });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(UserOnboardingLibService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();

class UserOnboardingLibComponent {
    constructor() { }
    ngOnInit() {
    }
}
UserOnboardingLibComponent.ɵfac = function UserOnboardingLibComponent_Factory(t) { return new (t || UserOnboardingLibComponent)(); };
UserOnboardingLibComponent.ɵcmp = ɵɵdefineComponent({ type: UserOnboardingLibComponent, selectors: [["lib-userOnboardingLib"]], decls: 2, vars: 0, template: function UserOnboardingLibComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "p");
        ɵɵtext(1, " user-onboarding-lib works! ");
        ɵɵelementEnd();
    } }, encapsulation: 2 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(UserOnboardingLibComponent, [{
        type: Component,
        args: [{
                selector: 'lib-userOnboardingLib',
                template: `
    <p>
      user-onboarding-lib works!
    </p>
  `,
                styles: []
            }]
    }], function () { return []; }, null); })();

class UserOnboardingLibModule {
}
UserOnboardingLibModule.ɵfac = function UserOnboardingLibModule_Factory(t) { return new (t || UserOnboardingLibModule)(); };
UserOnboardingLibModule.ɵmod = ɵɵdefineNgModule({ type: UserOnboardingLibModule });
UserOnboardingLibModule.ɵinj = ɵɵdefineInjector({ imports: [[]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(UserOnboardingLibModule, { declarations: [UserOnboardingLibComponent], exports: [UserOnboardingLibComponent] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵsetClassMetadata(UserOnboardingLibModule, [{
        type: NgModule,
        args: [{
                declarations: [
                    UserOnboardingLibComponent
                ],
                imports: [],
                exports: [
                    UserOnboardingLibComponent
                ]
            }]
    }], null, null); })();

/*
 * Public API Surface of user-onboarding-lib
 */

/**
 * Generated bundle index. Do not edit.
 */

export { UserOnboardingLibComponent, UserOnboardingLibModule, UserOnboardingLibService };
//# sourceMappingURL=user-onboarding-lib.js.map

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('user-onboarding-lib', ['exports', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['user-onboarding-lib'] = {}, global.ng.core));
}(this, (function (exports, i0) { 'use strict';

    var UserOnboardingLibService = /** @class */ (function () {
        function UserOnboardingLibService() {
        }
        return UserOnboardingLibService;
    }());
    UserOnboardingLibService.ɵfac = function UserOnboardingLibService_Factory(t) { return new (t || UserOnboardingLibService)(); };
    UserOnboardingLibService.ɵprov = i0.ɵɵdefineInjectable({ token: UserOnboardingLibService, factory: UserOnboardingLibService.ɵfac, providedIn: 'root' });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(UserOnboardingLibService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return []; }, null);
    })();

    var UserOnboardingLibComponent = /** @class */ (function () {
        function UserOnboardingLibComponent() {
        }
        UserOnboardingLibComponent.prototype.ngOnInit = function () {
        };
        return UserOnboardingLibComponent;
    }());
    UserOnboardingLibComponent.ɵfac = function UserOnboardingLibComponent_Factory(t) { return new (t || UserOnboardingLibComponent)(); };
    UserOnboardingLibComponent.ɵcmp = i0.ɵɵdefineComponent({ type: UserOnboardingLibComponent, selectors: [["lib-userOnboardingLib"]], decls: 2, vars: 0, template: function UserOnboardingLibComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "p");
                i0.ɵɵtext(1, " user-onboarding-lib works! ");
                i0.ɵɵelementEnd();
            }
        }, encapsulation: 2 });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(UserOnboardingLibComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'lib-userOnboardingLib',
                        template: "\n    <p>\n      user-onboarding-lib works!\n    </p>\n  ",
                        styles: []
                    }]
            }], function () { return []; }, null);
    })();

    var UserOnboardingLibModule = /** @class */ (function () {
        function UserOnboardingLibModule() {
        }
        return UserOnboardingLibModule;
    }());
    UserOnboardingLibModule.ɵfac = function UserOnboardingLibModule_Factory(t) { return new (t || UserOnboardingLibModule)(); };
    UserOnboardingLibModule.ɵmod = i0.ɵɵdefineNgModule({ type: UserOnboardingLibModule });
    UserOnboardingLibModule.ɵinj = i0.ɵɵdefineInjector({ imports: [[]] });
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(UserOnboardingLibModule, { declarations: [UserOnboardingLibComponent], exports: [UserOnboardingLibComponent] }); })();
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(UserOnboardingLibModule, [{
                type: i0.NgModule,
                args: [{
                        declarations: [
                            UserOnboardingLibComponent
                        ],
                        imports: [],
                        exports: [
                            UserOnboardingLibComponent
                        ]
                    }]
            }], null, null);
    })();

    /*
     * Public API Surface of user-onboarding-lib
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.UserOnboardingLibComponent = UserOnboardingLibComponent;
    exports.UserOnboardingLibModule = UserOnboardingLibModule;
    exports.UserOnboardingLibService = UserOnboardingLibService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=user-onboarding-lib.umd.js.map

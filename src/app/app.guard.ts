import { Injectable, Inject } from '@angular/core';
import { Router, CanActivateChild } from '@angular/router';

@Injectable()
export class AuthenticatedGuard implements CanActivateChild {
    constructor(
        @Inject('IUtilService')
        private _us: wy.IUtilService,

        @Inject('IConstantService')
        private _cs: wy.IConstantService,

        private _router: Router
    ) {
    }

    canActivateChild(): boolean {
        const currentUrl = this._router.url;

        if (this._us.hasValidJwt() || currentUrl == this._cs.getLoginPageUrl()) {
            return true;
        }
        else {
            this._router.navigate([this._cs.getLoginPageUrl()]);
            return false;
        }
    }
}

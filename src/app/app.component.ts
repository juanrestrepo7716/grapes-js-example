//::Bag::Default
import { Component, OnInit, NgZone, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from './services/event.service';
@Component({
    // tslint:disable-next-line
    selector: 'body',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    private tokenProcessHandle: any;
    public roleClass: string;
    public ready: boolean;
    constructor(
        protected zone: NgZone,
        @Inject('IUtilService')
        private _us: wy.IUtilService,
        @Inject('IConstantService')
        private _cs: wy.IConstantService,
        @Inject('IAuthenticationService')
        private _as: wy.IAuthenticationService,
        @Inject('IAuthorizationService')
        private _azs: wy.IAuthorizationService,
        @Inject('IUserSettingsService')
        private _usrSet: wy.IUserSettingsService,
        @Inject('ILanguageService')
        private _ls: wy.ILanguageService,
        @Inject('IMessageService')
        private _ms: wy.IMessageService,
        private _router: Router,
        private _es: EventService) {
        this.zone.onError.subscribe((e) => {
            this._ms.notify(this._ls.translate('BackgroundError'), 'warning');
        });
    }
    async loadRolesAndAuthorizations(jwt: wy.Jwt) {
        if (!jwt) {
            return;
        }
        // refresh authorization map and user settings
        await this._azs.refreshAuthorizationMaps();
        await this._usrSet.refreshUserSettings();
        const authorizationMapsEnabled = this._azs.isAuthorizationMapsEnabled();
        if (!authorizationMapsEnabled) {
            // apply role(s) from jwt
            this.applyRoleClass(jwt.role || jwt.roles);
        }
        else {
            // apply role(s) from authorization map
            const authorizationMap = this._azs.getAuthorizationMap();
            if (authorizationMap) {
                this.applyRoleClassArray(authorizationMap.Roles);
            }
        }
    }
    async ngOnInit() {
        const jwt = this._us.getValidatedJwt();
        await this.loadRolesAndAuthorizations(jwt);
        this._es.userAuthenticated.subscribe(async jwt => {
            this.ready = false;
            await this.loadRolesAndAuthorizations(jwt);
            this.ready = true;
        });
        // refresh token in background
        const config = this._cs.getConfig();
        const accessTokenTimeoutInSeconds = parseInt(config.accessTokenTimeoutInSeconds);
        if (accessTokenTimeoutInSeconds > 0) {
            this.tokenProcessHandle = setInterval(() => {
                const currentUrl = this._router.url;
                if (currentUrl != this._cs.getLoginPageUrl()) {
                    if (this._us.canRefreshJwt()) {
                        this._as.refreshToken(
                            () => {
                            },
                            () => {
                                this._us.logoutIfInvalidJwt();
                            }
                        );
                    } else {
                        this._us.logoutIfInvalidJwt();
                    }
                }
            }, (accessTokenTimeoutInSeconds / 4) * 1000);
        }
        this.ready = true;
    }
    private applyRoleClass(roles: string) {
        if (roles) {
            this.applyRoleClassArray(roles.split(' '));
        }
    }
    private applyRoleClassArray(roles: string[]) {
        let newRoleClass = '';
        if (roles) {
            for (let role of roles) {
                if (role) {
                    newRoleClass += ' wy-role-' + role.toLowerCase().split(' ').join('_');
                }
            }
        }
        this.roleClass = newRoleClass;
    }
    ngOnDestroy() {
        if (this.tokenProcessHandle) {
            clearInterval(this.tokenProcessHandle);
        }
    }
}

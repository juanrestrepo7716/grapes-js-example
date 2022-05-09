//::Bag::Default
import { Component, Inject, OnInit, isDevMode, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    templateUrl: 'login.component.html',
    styleUrls: [
        './login.component.scss'
    ],
})
export class LoginComponent implements OnInit {
    protected static defaultTenant = 'default';
    activeStep = 0;
    credentials: wy.Credentials;
    tenants: wy.ITenantDetails[];
    constructor(
        private _router: Router,
        @Inject('IAuthenticationService')
        private _as: wy.IAuthenticationService,
        @Inject('IMessageService')
        private _ms: wy.IMessageService,
        @Inject('IConstantService')
        private _cs: wy.IConstantService,
        @Inject('IUtilService')
        private _us: wy.IUtilService,
        @Inject('ILanguageService')
        private _ls: wy.ILanguageService,
        @Inject(LOCALE_ID) protected currentCulture: string
    ) {
        this.credentials = {
            userName: '',
            password: '',
            tenant: LoginComponent.defaultTenant,
            verificationCode: '',
            enableRefresh: false,
        };
    }
    ngOnInit(): void {
        this.checkIfJwtStillValid();
    }
    private checkIfJwtStillValid() {
        const jwt = this._us.getValidatedJwt();
        if (jwt != null) {
            this.handleValidJwt(jwt);
        }
    }
    private trimCredentials() {
        if (this.credentials.userName) {
            this.credentials.userName = this.credentials.userName.trim();
        }
        if (this.credentials.password) {
            this.credentials.password = this.credentials.password.trim();
        }
    }
    preAuthenticate() {
        if (!this.credentials.userName || !this.credentials.tenant) {
            return;
        }
        this.trimCredentials();
        this._ms.showProgress(this._ls.translate('Loading') + '...', this._ls.translate('PleaseWait') + '...');
        this._as.preAuthenticate(this.credentials,
            (tenants: wy.IAvailableTenant[]) => {
                if (tenants.length == 1) {
                    // don't show tenant selection
                    const firstTenant = tenants[0];
                    this.selectTenant(firstTenant);
                }
                else {
                    // sort and show tenant selection
                    this.tenants = tenants.sort((a, b) => (a.TenantName > b.TenantName) ? 1 : -1);
                    this.activeStep = 1;
                    this._ms.hideProgress();
                }
            },
            () => {
                this._ms.hideProgress();
                this._ms.modalMessage(this._ls.translate('Failed'), this._ls.translate('AuthenticationFailed'));
            }
        );
    }
    selectTenant(tenant: wy.IAvailableTenant) {
        this.credentials.tenant = tenant.TenantName;
        if (tenant.RequireTwoFactorAuthentication) {
            this.activeStep = 2;
        }
        else {
            this.authenticate();
        }
    }
    authenticate() {
        this.trimCredentials();
        this._ms.showProgress(this._ls.translate('Loading') + '...', this._ls.translate('PleaseWait') + '...');
        this._as.authenticate(this.credentials,
            async (jwt: wy.Jwt) => {
                this.handleValidJwt(jwt);
                this._ms.hideProgress();
            },
            () => {
                this._ms.hideProgress();
                this._ms.modalMessage(this._ls.translate('Failed'), this._ls.translate('AuthenticationFailed'));
            }
        );
    }
    handleValidJwt(jwt: wy.Jwt) {
        const initialUrl = '/app/todoitems/gridpage';
        if (!isDevMode() && jwt.culture) {
            const currentCulture = this.currentCulture;
            const defaultCulture = this._cs.getConfig().defaultCultureTwoLetterISOLanguageName;
            console.log('Current culture.', currentCulture);
            if (jwt.culture != currentCulture) {
                if (jwt.culture == defaultCulture) {
                    // redirect to default culture
                    window.location.href = initialUrl;
                    return;
                }
                else {
                    // redirect to correct culture
                    window.location.href = '/' + jwt.culture + initialUrl;
                    return;
                }
            }
        }
        this._router.navigateByUrl(initialUrl);
    }
}

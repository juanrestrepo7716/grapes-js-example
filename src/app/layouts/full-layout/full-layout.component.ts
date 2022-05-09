import { HttpClient } from '@angular/common/http';
//::Bag::Default
import { isDevMode, ViewEncapsulation } from '@angular/core';
/*--
[% if UserInterface.OverrideFullLayoutComponent %]
    [[ UserInterface.OverrideFullLayoutComponent.ComponentImports ]]
[% else %]
--*/
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseHttpService } from 'src/app/services/base-http.service';
/*--
[% endif %]
--*/

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'wy-full-layout',
    templateUrl: './full-layout.component.html',
    styleUrls: [
        './full-layout.component.scss'
    ],
})
/*--
[% if UserInterface.OverrideFullLayoutComponent %]
    [[ UserInterface.OverrideFullLayoutComponent.ComponentSource ]]
[% else %]
--*/
export class FullLayoutComponent implements OnInit {
    private static defaultUserImage = 'assets/img/avatars/default-avatar.png';

    public drawerMode: "push" | "overlay";
    public drawerExpanded: boolean;
    public headerMode: "show" | "hide";

    public showMain = true;
    public userName: string;
    public tooltip: string;
    public tenant: string;
    public isLoading = true;
    public userImage = FullLayoutComponent.defaultUserImage;
    public appLauncherConfig: wy.IAppLauncherConfig;
    public showAppLauncher = false;

    public dialogWidth: number;
    public dialogHeight: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cd: ChangeDetectorRef,
        private http: HttpClient,

        @Inject('IUtilService')
        private _us: wy.IUtilService,

        @Inject('IConstantService')
        private _cs: wy.IConstantService,

        @Inject('IDataService')
        private _ds: wy.IDataService
    ) {
        this.route.params.subscribe(params => {
            this.handleRouteChange();
        });

        this.router.events.subscribe(params => {
            this.handleRouteChange();
        });

        if (window.innerWidth > 992 && window.innerHeight > 720) {
            this.dialogWidth = undefined;
            this.dialogHeight = undefined;
        }
        else {
            this.dialogWidth = window.innerWidth - 10;
            this.dialogHeight = window.innerHeight - 10;
        }

        const instance = this;

        // intercepts all requests
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            instance.isLoading = true;
            instance.cd.detectChanges();

            this.addEventListener('load', function () {
                instance.isLoading = false;
                instance.cd.detectChanges();
            });

            return origOpen.apply(this, arguments);
        };

        // menu/header handling
        let hideMenu = this.route.snapshot.queryParams["hideMenu"];
        let hideHeader = this.route.snapshot.queryParams["hideHeader"];

        if (hideMenu) {
            // hide menu based on query param
            this.drawerMode = "overlay";
            this.drawerExpanded = false;
        }
        else {
            // hide menu based on screen size
            if (this._us.isSizeMedium()) {
                this.drawerMode = "overlay";
                this.drawerExpanded = false;
            } else {
                this.drawerMode = "push";
                this.drawerExpanded = true;
            }
        }

        if (hideHeader) {
            this.headerMode = "hide";
        }
        else {
            this.headerMode = "show";
        }
    }

    async ngOnInit() {
        const jwt = this._us.getValidatedJwt();

        if (jwt) {
            this.userName = jwt.name ? jwt.name : jwt.username;
            this.userImage = jwt.userImage ? jwt.userImage : FullLayoutComponent.defaultUserImage;

            this.tooltip = '';
            for (const key of Object.keys(jwt)) {
                this.tooltip += `${key}: ${jwt[key]}\n`;
            }

            if (jwt.tenant) {
                this.tenant = jwt.tenant;
            }
        }

        const config = this._cs.getConfig();
        if (config.appLauncherConfigUri) {
            this.appLauncherConfig = await this.http.get<wy.IAppLauncherConfig>(config.appLauncherConfigUri, BaseHttpService.AsHttpJson()).toPromise();
        }

        this.isLoading = false;
    }

    setDefaultUserImage() {
        if (this.userImage != FullLayoutComponent.defaultUserImage) {
            this.userImage = FullLayoutComponent.defaultUserImage;
        }
    }

    handleRouteChange() {
        this.reloadRoute();

        if (this.drawerMode == "overlay") {
            this.drawerExpanded = false;
        }
    }

    logout(): boolean {
        this._us.logout();
        return false;
    }

    triggerOperation(dataStoreName: string, operationName: string, pictureUrl: string, confirmationMessage: string) {
        if (!confirmationMessage || confirm(confirmationMessage)) {
            this._ds.triggerOperation(dataStoreName, null, operationName, null, null, pictureUrl);
        }
    }

    isRouteActive(route: string) {
        return this.router.isActive(route, false);
    }

    reloadRoute() {
        this.showMain = false;

        setTimeout(() => {
            this.showMain = true;
        });
    }

    toggleAppLauncher() {
        this.showAppLauncher = !this.showAppLauncher;
    }

    navigateApp(url: string) {
        const jwt = this._us.getValidatedJwt();

        if (!isDevMode() && jwt.culture) {
            const defaultCulture = this._cs.getConfig().defaultCultureTwoLetterISOLanguageName;

            if (jwt.culture != defaultCulture) {
                // redirect directly to specific culture
                window.location.href = url + jwt.culture;
                return;
            }
        }

        window.location.href = url;
    }
}
/*--
[% endif %]
--*/

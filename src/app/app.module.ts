//::Bag::All
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { AppComponent } from './app.component';
import 'hammerjs';
// Import pages
import { LoginComponent } from './pages/simple/login/login.component';
import { P500Component } from './pages/simple/500/500.component';
import { P404Component } from './pages/simple/404/404.component';
import { AppDownloadComponent } from './pages/simple/app-download/app-download.component';
import { EmptyPageComponent } from './pages/full/emptypage/emptypage.component';
import { UtilsPageComponent } from './pages/full/utilspage/utilspage.component';
import { BlobPageComponent } from './pages/full/blobpage/blobpage.component';
import { PageComponent_Demo } from './pages/full/page/page.component';
import { PageComponent_Dashboard } from './pages/full/page/page.component';
import { PageComponent_Reports } from './pages/full/page/page.component';
import { GridPageComponent_SocialComment } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_SocialComment } from './pages/full/editpage/editpage.component';
import { GridPageComponent_SocialReaction } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_SocialReaction } from './pages/full/editpage/editpage.component';
import { GridPageComponent_TodoItem } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_TodoItem } from './pages/full/editpage/editpage.component';
import { GridPageComponent_Project } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_Project } from './pages/full/editpage/editpage.component';
import { GridPageComponent_User } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_User } from './pages/full/editpage/editpage.component';
import { GridPageComponent_Action } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_Action } from './pages/full/editpage/editpage.component';
import { GridPageComponent_Message } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_Message } from './pages/full/editpage/editpage.component';
import { GroupPageComponent_Social } from './pages/full/grouppage/grouppage.component';
// Import layouts
import {
    FullLayoutComponent,
    SimpleLayoutComponent
} from './layouts';
const APP_LAYOUTS = [
    FullLayoutComponent,
    SimpleLayoutComponent
]
// Import routing module
import { AppRoutingModule } from './app.routing';
// Import components
import { WyDefaultModule } from './components/wy-default.module';
import { WyCustomModule } from './components/wy-custom.module';
// Internationalization
import { load, IntlModule } from '@progress/kendo-angular-intl';
import '@progress/kendo-angular-intl/locales/en/all';
// Services
import { AuthenticationService } from './services/authentication.service';
import { ConstantService } from './services/constant.service';
import { LanguageService } from './services/language.service';
import { UtilService } from './services/util.service';
import { MessageService, MessageServiceEmbedHtmlComponent } from './services/message.service';
import { LinkService } from './services/link.service';
import { DataService } from './services/data.service';
import { BlobService } from './services/blob.service';
import { EventService } from './services/event.service';
import { MonacoService } from './services/monaco.service';
import { SocialService } from './services/social.service';
import { StorageService } from './services/storage.service';
import { AuthorizationService } from './services/authorization.service';
import { UserSettingsService } from './services/usersettings.service';
// Modules
@NgModule({
    imports: [
        BrowserModule,
        NoopAnimationsModule,
        AppRoutingModule,
        FormsModule,
        PortalModule,
        IntlModule,
        WyDefaultModule,
        WyCustomModule,
    ],
    declarations: [
        AppComponent,
        ...APP_LAYOUTS,
        P404Component,
        P500Component,
        AppDownloadComponent,
        LoginComponent,
        MessageServiceEmbedHtmlComponent,
        EmptyPageComponent,
        UtilsPageComponent,
        BlobPageComponent,
        PageComponent_Demo,
        PageComponent_Dashboard,
        PageComponent_Reports,
        GridPageComponent_SocialComment,
        EditPageComponent_SocialComment,
        GridPageComponent_SocialReaction,
        EditPageComponent_SocialReaction,
        GridPageComponent_TodoItem,
        EditPageComponent_TodoItem,
        GridPageComponent_Project,
        EditPageComponent_Project,
        GridPageComponent_User,
        EditPageComponent_User,
        GridPageComponent_Action,
        EditPageComponent_Action,
        GridPageComponent_Message,
        EditPageComponent_Message,
        GroupPageComponent_Social,
    ],
    entryComponents: [MessageServiceEmbedHtmlComponent],
    providers: [
        {
            provide: 'IAuthenticationService',
            useClass: AuthenticationService
        },
        {
            provide: 'IBlobService',
            useClass: BlobService
        },
        {
            provide: 'IConstantService',
            useFactory: constantServiceFactory
        },
        {
            provide: 'IUtilService',
            useClass: UtilService
        },
        {
            provide: 'ILinkService',
            useClass: LinkService
        },
        {
            provide: 'IMessageService',
            useClass: MessageService
        },
        {
            provide: 'ILanguageService',
            useClass: LanguageService
        },
        {
            provide: 'IDataService',
            useClass: DataService
        },
        {
            provide: 'ISocialService',
            useClass: SocialService
        },
        {
            provide: 'IStorageService',
            useClass: StorageService
        },
        {
            provide: 'IAuthorizationService',
            useClass: AuthorizationService
        },
        {
            provide: 'IUserSettingsService',
            useClass: UserSettingsService
        },
        EventService,
        MonacoService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    public static config: wy.IConfig;
}
export function constantServiceFactory() {
    return new ConstantService(
        AppModule.config,
        'Todo',
        'default');
}

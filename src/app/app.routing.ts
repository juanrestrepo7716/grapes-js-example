//::Bag::Routing
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import Guard
import { AuthenticatedGuard } from './app.guard';
// Pages
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
import { GridPageComponent_Action } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_Action } from './pages/full/editpage/editpage.component';
import { GridPageComponent_Message } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_Message } from './pages/full/editpage/editpage.component';
import { GridPageComponent_Project } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_Project } from './pages/full/editpage/editpage.component';
import { GridPageComponent_SocialComment } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_SocialComment } from './pages/full/editpage/editpage.component';
import { GridPageComponent_SocialReaction } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_SocialReaction } from './pages/full/editpage/editpage.component';
import { GridPageComponent_TodoItem } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_TodoItem } from './pages/full/editpage/editpage.component';
import { GridPageComponent_User } from './pages/full/gridpage/gridpage.component';
import { EditPageComponent_User } from './pages/full/editpage/editpage.component';
import { GroupPageComponent_Social } from './pages/full/grouppage/grouppage.component';
// Import layouts
import {
    FullLayoutComponent,
    SimpleLayoutComponent
} from './layouts';
export const routes: Routes = [
    {
        path: '',
        redirectTo: '/pages/login',
        pathMatch: 'full',
    },
    {
        path: 'app',
        canActivateChild: [AuthenticatedGuard],
        component: FullLayoutComponent,
        children: [
            {
                path: 'utils',
                component: UtilsPageComponent,
            },
            {
                path: 'empty',
                component: EmptyPageComponent,
            },
            {
                path: 'blobpage',
                component: BlobPageComponent,
            },
            {
                path: 'actions/gridpage',
                component: GridPageComponent_Action
            },
            {
                path: 'actions/gridpage/:filter',
                component: GridPageComponent_Action
            },
            {
                path: 'actions/editpage/:id',
                component: EditPageComponent_Action
            },
            {
                path: 'messages/gridpage',
                component: GridPageComponent_Message
            },
            {
                path: 'messages/gridpage/:filter',
                component: GridPageComponent_Message
            },
            {
                path: 'messages/editpage/:id',
                component: EditPageComponent_Message
            },
            {
                path: 'projects/gridpage',
                component: GridPageComponent_Project
            },
            {
                path: 'projects/gridpage/:filter',
                component: GridPageComponent_Project
            },
            {
                path: 'projects/editpage/:id',
                component: EditPageComponent_Project
            },
            {
                path: 'socialcomments/gridpage',
                component: GridPageComponent_SocialComment
            },
            {
                path: 'socialcomments/gridpage/:filter',
                component: GridPageComponent_SocialComment
            },
            {
                path: 'socialcomments/editpage/:id',
                component: EditPageComponent_SocialComment
            },
            {
                path: 'socialreactions/gridpage',
                component: GridPageComponent_SocialReaction
            },
            {
                path: 'socialreactions/gridpage/:filter',
                component: GridPageComponent_SocialReaction
            },
            {
                path: 'socialreactions/editpage/:id',
                component: EditPageComponent_SocialReaction
            },
            {
                path: 'todoitems/gridpage',
                component: GridPageComponent_TodoItem
            },
            {
                path: 'todoitems/gridpage/:filter',
                component: GridPageComponent_TodoItem
            },
            {
                path: 'todoitems/editpage/:id',
                component: EditPageComponent_TodoItem
            },
            {
                path: 'users/gridpage',
                component: GridPageComponent_User
            },
            {
                path: 'users/gridpage/:filter',
                component: GridPageComponent_User
            },
            {
                path: 'users/editpage/:id',
                component: EditPageComponent_User
            },
            {
                path: 'social/grouppage',
                component: GroupPageComponent_Social
            },
            {
                path: 'demo',
                component: PageComponent_Demo
            },
            {
                path: 'dashboard',
                component: PageComponent_Dashboard
            },
            {
                path: 'reports',
                component: PageComponent_Reports
            },
            {
                path: 'home',
                component: EmptyPageComponent,
            },
        ]
    },
    {
        path: 'pages',
        component: SimpleLayoutComponent,
        children: [
            {
                path: '404',
                component: P404Component
            },
            {
                path: '500',
                component: P500Component
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'app-download',
                component: AppDownloadComponent
            },
        ]
    },
    {
        path: '**',
        redirectTo: '/pages/404'
    }
];
@NgModule({
    providers: [AuthenticatedGuard],
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

//::Bag::Pages
import { Component, AfterViewInit, Inject, ViewChild, ElementRef } from '@angular/core';
@Component({
    selector: 'wy-page-demo',
    template: `
<div>
    <h3 class="wy-hdr" #title [hidden]="!showPageTitle()" i18n="@@DisplayLabelPage_Demo">
        Demo
    </h3>
    <div class="row flex-wrap-row">
            <div class="col-sm-6">
                    <wy-component-mycustomcomponent2></wy-component-mycustomcomponent2>
            </div>
            <div class="col-sm-3">
                    <wy-component-mycustomcomponent></wy-component-mycustomcomponent>
            </div>
            <div class="col-sm-3">
                    <wy-component-todoitemscomponent></wy-component-todoitemscomponent>
            </div>
    </div>
</div>
`,
    styleUrls: ['./page.component.scss']
})
export class PageComponent_Demo implements AfterViewInit {
    @ViewChild('title')
    title: ElementRef;
    constructor(
        @Inject('IUtilService')
        private _us: wy.IUtilService
    ) {
    }
    ngAfterViewInit() {
        this._us.setDocumentTitle(this.title.nativeElement.textContent);
    }
    showPageTitle(): boolean {
        return true;
    }
}
@Component({
    selector: 'wy-page-dashboard',
    template: `
<div>
    <h3 class="wy-hdr" #title [hidden]="!showPageTitle()" i18n="@@DisplayLabelPage_Dashboard">
        Dashboard
    </h3>
    <div class="row flex-wrap-row">
            <div class="col-sm-12">
                    <wy-component-dashboardcomponent></wy-component-dashboardcomponent>
            </div>
    </div>
</div>
`,
    styleUrls: ['./page.component.scss']
})
export class PageComponent_Dashboard implements AfterViewInit {
    @ViewChild('title')
    title: ElementRef;
    constructor(
        @Inject('IUtilService')
        private _us: wy.IUtilService
    ) {
    }
    ngAfterViewInit() {
        this._us.setDocumentTitle(this.title.nativeElement.textContent);
    }
    showPageTitle(): boolean {
        return false;
    }
}
@Component({
    selector: 'wy-page-reports',
    template: `
<div>
    <h3 class="wy-hdr" #title [hidden]="!showPageTitle()" i18n="@@DisplayLabelPage_Reports">
        Reports
    </h3>
    <div class="row flex-wrap-row">
            <div class="col-sm-12">
                    <wy-component-reportscomponent></wy-component-reportscomponent>
            </div>
    </div>
</div>
`,
    styleUrls: ['./page.component.scss']
})
export class PageComponent_Reports implements AfterViewInit {
    @ViewChild('title')
    title: ElementRef;
    constructor(
        @Inject('IUtilService')
        private _us: wy.IUtilService
    ) {
    }
    ngAfterViewInit() {
        this._us.setDocumentTitle(this.title.nativeElement.textContent);
    }
    showPageTitle(): boolean {
        return true;
    }
}

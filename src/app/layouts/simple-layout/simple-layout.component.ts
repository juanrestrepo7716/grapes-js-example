//::Bag::Default
import { Component, OnInit, AfterViewInit, Inject, ViewEncapsulation } from '@angular/core';
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'wy-simple-layout',
    templateUrl: 'simple-layout.component.html',
    styleUrls: [
        './simple-layout.component.scss'
    ],
})
export class SimpleLayoutComponent implements OnInit, AfterViewInit {
    constructor(
        @Inject('IUtilService')
        private _us: wy.IUtilService
    ) {
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        this._us.setDocumentTitle(null);
    }
}

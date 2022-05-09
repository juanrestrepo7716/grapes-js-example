import { Component, Input, Output, EventEmitter, TemplateRef, ViewChild, AfterViewInit, OnDestroy, ApplicationRef, ComponentFactoryResolver, Injector, EmbeddedViewRef, ViewEncapsulation, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CdkPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { PortalHostDivId } from '../constants';

@Component({
    selector: 'wy-entity-window',
    templateUrl: './wy-entity-window.component.html',
    styleUrls: [
        './wy-entity-window.component.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class WyEntityWindowComponent implements AfterViewInit, OnDestroy {

    @ViewChild(CdkPortal)
    portal: CdkPortal;

    @Input() public title: string;
    @Input() public entity: wy.BaseEntity;
    @Input() public readonly: boolean;
    @Input() public isNew: boolean;
    @Input() public color: string;
    @Input() public icon: string = 'fas fa-dot-circle';

    @Output() save: EventEmitter<wy.ISaveEvent> = new EventEmitter();
    @Output() cancel: EventEmitter<any> = new EventEmitter();

    @ViewChild('windowTitleBar', { static: true }) windowTitleBar: TemplateRef<any>;
    @ViewChild('windowContent', { static: true }) windowContent: TemplateRef<any>;

    public windowWidth: number;
    public windowHeight: number;
    public windowTop: number;
    public windowLeft: number;

    private embeddedViewRef: EmbeddedViewRef<any>;

    constructor(
        private cfr: ComponentFactoryResolver,
        private ar: ApplicationRef,
        private cd: ChangeDetectorRef,
        private injector: Injector) {
        const existingWindowCount = document.getElementsByTagName('wy-entity-window').length;

        if (window.innerWidth > 992 && window.innerHeight > 720) {
            const marginLeft = (existingWindowCount * 100);
            const marginTop = 70 + (existingWindowCount * 60);
            const marginBottom = 3;

            this.windowLeft = (window.innerWidth / 3) + marginLeft;
            this.windowTop = marginTop;
            this.windowWidth = window.innerWidth - this.windowLeft;
            this.windowHeight = window.innerHeight - this.windowTop - marginBottom;
        }
        else {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
            this.windowTop = 0;
            this.windowLeft = 0;
        }
    }

    ngAfterViewInit() {
        this.embeddedViewRef = new DomPortalOutlet(
            document.getElementById(PortalHostDivId),
            this.cfr,
            this.ar,
            this.injector
        ).attachTemplatePortal(this.portal);
    }

    ngOnDestroy() {
        this.embeddedViewRef.destroy();
    }

    public cancelHandler() {
        this.cancel.emit();
    }

    public saveHandler(saveEvent: wy.ISaveEvent) {
        this.save.emit(saveEvent);
    }
}

import { Component, Input, OnInit, Inject } from '@angular/core';

@Component({
    selector: 'wy-image-viewer',
    templateUrl: './wy-image-viewer.component.html',
    styleUrls: [
        './wy-image-viewer.component.scss'
    ]
})
export class WyImageViewerComponent implements OnInit {

    @Input() public title: string;
    @Input() public src: string;
    @Input() public largeThumbnail: boolean;
    @Input() public size: number;

    public isImageViewerOpen: boolean;
    public prettySize = '';

    public dialogWidth: number;
    public dialogHeight: number;

    constructor(
        @Inject('IUtilService')
        private _us: wy.IUtilService) {
        if (window.innerWidth > 992 && window.innerHeight > 720) {
            this.dialogWidth = window.innerWidth - 150;
            this.dialogHeight = window.innerHeight - 50;
        }
        else {
            this.dialogWidth = window.innerWidth - 10;
            this.dialogHeight = window.innerHeight - 10;
        }
    }

    openImageViewer(event: Event) {
        this.isImageViewerOpen = true;
        event.stopPropagation();
    }

    closeImageViewer() {
        this.isImageViewerOpen = false;
    }

    ngOnInit() {
        if (this.size > 0) {
            this.prettySize = '(' + this._us.formatBytes(this.size, 1) + ')';
        }
    }
}

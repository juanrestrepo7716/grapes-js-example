import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SuccessEvent } from '@progress/kendo-angular-upload';
import { WyQuickSearchComponent } from '../wy-quick-search/wy-quick-search.component';

@Component({
    selector: 'wy-blob-manager',
    templateUrl: './wy-blob-manager.component.html',
    styleUrls: ['./wy-blob-manager.component.scss']
})
export class WyBlobManagerComponent implements OnInit {
    public blobs: wy.Blob[];

    public uploadSaveUrl: string;

    @ViewChild('quickSearch')
    quickSearch: WyQuickSearchComponent;

    @Input() public showItems: number;
    @Input() public loadOnlyImages = false;

    @Input() public set model(blobName: any) {
        this.selectedBlobName = blobName;
    }

    @Output() blobSelected: EventEmitter<string> = new EventEmitter();

    public selectedBlobName: string;

    constructor(
        @Inject('IBlobService')
        private _bs: wy.IBlobService,

        @Inject('IUtilService')
        private _us: wy.IUtilService,

        @Inject('IConstantService')
        private _cs: wy.IConstantService,
    ) {
        this.uploadSaveUrl = this._cs.getServiceLayerBlobUri() + '/post';

        this.showItems = 20;
        this.selectedBlobName = null;
    }

    public showMore() {
        this.showItems += 20;
    }

    public selectBlob(blob: wy.Blob) {
        if (this.selectedBlobName == blob.Name) {
            this.selectedBlobName = null;
        }
        else {
            this.selectedBlobName = blob.Name;
        }

        this.blobSelected.emit(this.selectedBlobName);
    }

    public getBlobUri(blob: wy.Blob) {
        return this._bs.getBlobUri(blob);
    }

    public deleteBlob(blob: wy.Blob) {
        if (confirm(`Delete ${blob.Name}?`)) {
            return this._bs.deleteBlob(blob, () => {
                this.loadBlobs();
            });
        }
    }

    public formatBytes(blob: wy.Blob) {
        return this._us.formatBytes(blob.Size, 2);
    }

    public uploadSuccessEventHandler(e: SuccessEvent) {
        if (e.files && e.files.length > 0) {
            // select uploaded blob
            const firstFile = e.files[0];

            this.selectedBlobName = firstFile.name;
            this.blobSelected.emit(this.selectedBlobName);
        }

        this.loadBlobs();
    }

    private loadBlobs() {
        this.blobs = null;

        if (this.loadOnlyImages) {
            this._bs.getImages((blobs) => {
                this.blobs = blobs;
            });
        }
        else {
            this._bs.getFiles((blobs) => {
                this.blobs = blobs;
            });
        }
    }

    ngOnInit() {
        this.loadBlobs();
    }
}

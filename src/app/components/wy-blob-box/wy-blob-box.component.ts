import { Component, OnInit, Inject, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'wy-blob-box',
    templateUrl: './wy-blob-box.component.html',
    styleUrls: [
        './wy-blob-box.component.scss'
    ],
})
export class WyBlobBoxComponent implements OnInit, OnChanges {

    @Input() public boxId: string;
    @Input() public largeThumbnail: boolean;

    public blobs: wy.Blob[];
    private _isInitiated = false;

    constructor(
        @Inject('IBlobService')
        private _bs: wy.IBlobService,

        @Inject('ILinkService')
        private _ls: wy.ILinkService
    ) { }

    ngOnInit() {
        this.loadBlobs();
        this._isInitiated = true;
    }

    ngOnChanges() {
        if (this._isInitiated) {
            this.loadBlobs();
        }
    }

    private loadBlobs() {
        this._bs.getFiles((blobs) => {
            this.blobs = blobs;
        }, this.boxId);
    }

    public getBlobUri(blobName: string, boxId?: string) {
        return this._bs.getBlobUriByName(blobName, boxId);
    }

    public getDownloadLink(blobName: string, size?: number, boxId?: string) {
        return this._ls.getDownloadLink(blobName, size, boxId);
    }
}

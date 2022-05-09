import { Component, OnInit, Inject, Input, ViewEncapsulation, ViewChild, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'wy-blob-viewer',
    templateUrl: './wy-blob-viewer.component.html',
    styleUrls: [
        './wy-blob-viewer.component.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class WyBlobViewerComponent implements OnInit, OnChanges {
    @ViewChild('pdfViewer') public pdfViewer: any;

    @Input() public boxId: string;

    public blob: wy.Blob;
    private _isInitiated = false;

    constructor(
        @Inject('IBlobService')
        private _bs: wy.IBlobService,

        @Inject('ILinkService')
        private _ls: wy.ILinkService,

        private http: HttpClient
    ) { }

    ngOnInit() {
        this.loadPicture();
        this._isInitiated = true;
    }

    ngOnChanges() {        
        if (this._isInitiated) {
            this.loadPicture();
        }
    }

    private loadPicture() {
        this._bs.getFiles(async (blobs) => {
            if (blobs.length > 0) {
                // viewer supports only 1 blob
                this.blob = blobs[0];

                if (this.blob.IsPdf) {
                    const uri = this.getBlobUri(this.blob.Name, this.blob.BoxId);
                    const binary = await this.downloadBlob(uri).toPromise();

                    this.pdfViewer.pdfSrc = binary;
                    this.pdfViewer.refresh();
                }
            }
        }, this.boxId);
    }

    private downloadBlob(uri: string): Observable<any> {
        return this.http
            .get(uri, {
                responseType: 'blob',
                withCredentials: true
            })
            .pipe(map(response => {
                return response;
            }));
    }

    public getBlobUri(blobName: string, boxId?: string) {
        return this._bs.getBlobUriByName(blobName, boxId, true);
    }
}

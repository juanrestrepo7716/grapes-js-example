import { Injectable, Inject } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { EMPTY_GUID } from '../components/constants';

@Injectable()
export class BlobService extends BaseHttpService implements wy.IBlobService {
    constructor(
        @Inject('IConstantService')
        private _cs: wy.IConstantService,

        private http: HttpClient
    ) {
        super();
    }

    public getImages(handler: (blobs: wy.Blob[]) => any, boxId?: string): void {
        this.getBlobs('list/images', handler, boxId);
    }

    public getFiles(handler: (blobs: wy.Blob[]) => any, boxId?: string): void {
        this.getBlobs('list', handler, boxId);
    }

    private getBlobs(listMethod: string, handler: (blobs: wy.Blob[]) => any, boxId?: string): void {
        const blobUri = this._cs.getServiceLayerBlobUri();

        this.http
            .get<any>(`${blobUri}/${listMethod}/${boxId ? boxId : EMPTY_GUID}`, BaseHttpService.AsHttpJson())
            .subscribe(blobs => {
                if (blobs.value) {
                    // NOTE: OData response detected, return inner value
                    return handler(blobs.value);
                }

                // TODO: remove legacy URL support
                return handler(blobs);
            });
    }

    public getBlobUri(blob: wy.Blob, boxId?: string, inline?: boolean): string {
        return this.getBlobUriByName(blob.Name, boxId, inline);
    }

    public getBlobUriByName(blobName: string, boxId?: string, inline?: boolean): string {
        const blobUri = this._cs.getServiceLayerBlobUri();

        return `${blobUri}/get/${blobName}/${boxId ? boxId : EMPTY_GUID}/${inline ? 'true' : 'false'}`;
    }

    public deleteBlob(blob: wy.Blob, handler: () => any, boxId?: string): void {
        this.deleteBlobByName(blob.Name, handler, boxId);
    }

    public deleteBlobByName(blobName: string, handler: () => any, boxId?: string): void {
        const blobUri = this._cs.getServiceLayerBlobUri();

        this.http
            .post(`${blobUri}/destroy/${blobName}/${boxId ? boxId : EMPTY_GUID}`, null, BaseHttpService.AsHttpJson())
            .subscribe(result => handler());
    }

    public deleteBlobBox(boxId: string, handler: () => any): void {
        const blobUri = this._cs.getServiceLayerBlobUri();

        this.http
            .post(`${blobUri}/destroybox/${boxId}`, null, BaseHttpService.AsHttpJson())
            .subscribe(result => handler());
    }

    public copyBlobBox(sourceBoxId: string, destinationBoxId: string, handler: () => any): void {
        const blobUri = this._cs.getServiceLayerBlobUri();

        this.http
            .post(`${blobUri}/copybox/${sourceBoxId}/${destinationBoxId}`, null, BaseHttpService.AsHttpJson())
            .subscribe(result => handler());
    }
}

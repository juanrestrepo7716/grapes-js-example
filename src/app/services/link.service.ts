import { Injectable, Inject } from '@angular/core';

@Injectable()
export class LinkService implements wy.ILinkService {
    constructor(
        @Inject('IConstantService')
        private _cs: wy.IConstantService,

        @Inject('IUtilService')
        private _us: wy.IUtilService,

        @Inject('IBlobService')
        private _bs: wy.IBlobService) {
    }

    public getDownloadLink(blobName: string, size?: number, boxId?: string): string {
        if (!blobName) {
            return '';
        }

        const url = this.getBlobUrl(blobName, boxId);
        const prettySizeSuffix = this.getPrettySizeSuffix(size);

        return `<a title="${blobName}${prettySizeSuffix}" href="${url}">${blobName}${prettySizeSuffix}</a>`;
    }

    private getPrettySizeSuffix(size?: number) {
        if (size) {
            return ' (' + this._us.formatBytes(size, 1) + ')';
        }
        else {
            return '';
        }
    }

    private getBlobUrl(blobName: string, boxId?: string) {
        return this._bs.getBlobUriByName(blobName, boxId);
    }

    public getLocationLink(latitude: number, longitude: number): string {
        const url = `https://www.google.com/maps?daddr=${latitude},${longitude}`;

        return `<a href="${url}" target="_blank"><i class="fas fa-map"></i></a> <span>${latitude}, ${longitude}</span>`;
    }
}

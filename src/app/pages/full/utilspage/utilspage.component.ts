//::Bag::Default
import { Inject, Component, OnInit } from '@angular/core';
import { FileRestrictions } from '@progress/kendo-angular-upload';
@Component({
    selector: 'wy-utilspage',
    templateUrl: './utilspage.component.html',
    styleUrls: ['./utilspage.component.scss']
})
export class UtilsPageComponent implements OnInit {
    uploadZipRestrictions: FileRestrictions = {
        allowedExtensions: ['.zip']
    };
    constructor(
        @Inject('IMessageService')
        private _ms: wy.IMessageService,
        @Inject('IUtilService')
        private _us: wy.IUtilService,
        @Inject('IConstantService')
        private _cs: wy.IConstantService,
        @Inject('ILanguageService')
        private _ls: wy.ILanguageService,
    ) {
        this._us.setDocumentTitle('Utils');
    }
    ngOnInit() {
    }
    showSuccess() {
        this._ms.modalMessage('Succeeded', 'The import from the zip file was successful.');
    }
    uploadImportBlobsUrl(dataStoreName: string) {
        return this._cs.getServiceLayerODataUri(dataStoreName, `/import/blobs`);
    }
    uploadImportEntitiesUrl(dataStoreName: string) {
        return this._cs.getServiceLayerODataUri(dataStoreName, `/import/entities`);
    }
    exportBlobs(dataStoreName: string) {
        const url = this._cs.getServiceLayerODataUri(dataStoreName, `/export/blobs`);
        window.location.href = url;
    }
    exportEntities(dataStoreName: string) {
        const url = this._cs.getServiceLayerODataUri(dataStoreName, `/export/entities`);
        window.location.href = url;
    }
}

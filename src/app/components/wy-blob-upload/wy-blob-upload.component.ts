//::Bag::Default
import { Component, Inject, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroupDirective, ControlContainer } from '@angular/forms';
import { FileRestrictions, RemoveEvent, FileInfo, SelectEvent } from '@progress/kendo-angular-upload';
@Component({
    selector: 'wy-blob-upload',
    templateUrl: `./wy-blob-upload.component.html`,
    styleUrls: [
        './wy-blob-upload.component.scss'
    ],
    viewProviders: [{
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }],
    encapsulation: ViewEncapsulation.None
})
export class WyBlobUploadComponent implements OnInit, OnChanges {
    public formControl: FormControl;
    @Input() public allowedExtensions: string;
    @Input() public multiple: boolean;
    @Input() public entityId: string;
    public blobsUploadSaveUrl: string;
    public blobList: Array<FileInfo>;
    private _isInitiated = false;
    private _formControlName: string;
    constructor(private parentForm: FormGroupDirective,
        @Inject('IConstantService')
        private cs: wy.IConstantService,
        @Inject('IBlobService')
        private bs: wy.IBlobService) {
    }
    @Input()
    set controlName(value: string) {
        this._formControlName = value;
        this.init();
    }
    private getCountControl() {
        return this.parentForm.form.get(this._formControlName + '_Count');
    }
    ngOnInit() {
        this.init();
        this._isInitiated = true;
    }
    ngOnChanges() {
        if (this._isInitiated) {
            this.init();
        }
    }
    private init() {
        if (this._formControlName) {
            this.formControl = this.parentForm.form.get(this._formControlName) as FormControl;
            if (this.formControl && this.formControl.value) {
                const boxId = this.formControl.value;
                this.blobsLoadBlobs(boxId);
            }
        }
    }
    public getRestrictions() {
        if (this.allowedExtensions) {
            return {
                allowedExtensions: this.allowedExtensions.split(",")
            } as FileRestrictions;
        }
        return null;
    }
    public downloadBlob(element: HTMLElement) {
        // TODO: This is a workaround, Kendo should implement this.
        if (element && element.classList.contains('k-file-name') && element.title) {
            const blobName = element.title;
            const url = this.bs.getBlobUriByName(blobName, this.formControl.value);
            window.location.href = url;
        }
    }
    // override blob remove
    public blobsRemoveUploadEventHandler(e: RemoveEvent) {
        this.ensureUploadReady(() => {
            const boxId = this.formControl.value;
            if (this.multiple) {
                // remove only this blob
                this.bs.deleteBlobByName(e.files[0].name, () => {
                    this.blobsLoadBlobs(boxId);
                }, boxId);
                this.storeBlobCount(e.files.length - 1);
            }
            else {
                // clear box
                this.bs.deleteBlobBox(boxId, () => {
                    this.blobsLoadBlobs(boxId);
                });
                this.storeBlobCount(0);
            }
        });
        e.preventDefault();
    }
    public blobsSelectUploadEventHandler(e: SelectEvent) {
        this.ensureUploadReady(() => { });
    }
    public blobsValueChangeUploadEventHandler(e: Array<FileInfo>) {
        this.storeBlobCount(e.length);
    }
    private storeBlobCount(value: number) {
        const countControl = this.getCountControl();
        // set blob count
        countControl.setValue(value);
        countControl.markAsDirty();
    }
    public ensureUploadReady(handler: () => any) {
        if (!this.formControl.dirty) {
            const boxId = this.formControl.value;
            const changeBoxId = uuid.v4();
            this.formControl.setValue(changeBoxId);
            this.formControl.markAsDirty();
            this.blobsUploadSaveUrl = this.cs.getServiceLayerBlobUri() + `/post/${changeBoxId}`;
            // copy
            this.bs.copyBlobBox(boxId, changeBoxId, handler);
        }
        else {
            handler();
        }
    }
    public blobsLoadBlobs(boxId: string) {
        this.bs.getFiles((blobs: wy.Blob[]) => {
            const list: Array<FileInfo> = [];
            for (const b of blobs) {
                list.push({ name: b.Name, size: b.Size });
            }
            this.blobList = list;
        }, boxId);
    }
}

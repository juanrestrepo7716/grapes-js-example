import { Component, Inject, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, ControlContainer } from '@angular/forms';

@Component({
    selector: 'wy-blob-picker',
    templateUrl: `./wy-blob-picker.component.html`,
    styleUrls: [
        './wy-blob-picker.component.scss'
    ],
    viewProviders: [{
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }]
})
export class WyBlobPickerComponent implements OnInit, OnChanges {
    public isBlobPickerActive = false;

    public blobDialogWidth: number;
    public blobDialogHeight: number;

    private _selectedBlobName: string;

    public formControl: FormControl;
    
    private _isInitiated = false;
    private _formControlName: string;

    @Input() public entityId: string;

    constructor(private parentForm: FormGroupDirective,
        @Inject('IBlobService')
        private bs: wy.IBlobService) {

        if (window.innerWidth > 992 && window.innerHeight > 720) {
            this.blobDialogWidth = window.innerWidth - 400;
            this.blobDialogHeight = window.innerHeight - 200;
        }
        else {
            this.blobDialogWidth = window.innerWidth - 10;
            this.blobDialogHeight = window.innerHeight - 10;
        }
    }

    @Input()
    set controlName(value: string) {
        this._formControlName = value;
        this.init();
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
        }
    }

    public getBlobUri(blobName: string) {
        return this.bs.getBlobUriByName(blobName);
    }

    public blobSelectedHandler(blobName: string) {
        this._selectedBlobName = blobName;
    }

    public openBlobPicker() {
        this.isBlobPickerActive = true;
    }

    public cancelBlobPicker() {
        this.isBlobPickerActive = false;
    }

    public selectBlobPicker() {
        // set blob as value
        const control = this.formControl;
        control.setValue(this._selectedBlobName);
        control.markAsDirty();
        this.isBlobPickerActive = false;
    }

    public clearBlobReference() {
        const control = this.formControl;
        control.setValue(null);
        control.markAsDirty();
    }
}

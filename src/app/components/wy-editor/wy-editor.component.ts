import { Component, ViewChild, Inject, Input } from '@angular/core';
import { FormControl, FormGroupDirective, ControlContainer } from '@angular/forms';
import { EditorComponent } from '@progress/kendo-angular-editor';

@Component({
    selector: 'wy-editor',
    templateUrl: `./wy-editor.component.html`,
    styleUrls: [
        './wy-editor.component.scss'
    ],
    viewProviders: [{
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }]
})
export class WyEditorComponent {
    public isBlobPickerActive = false;
    public isBlobPickerImagesOnly = false;

    public blobDialogWidth: number;
    public blobDialogHeight: number;

    private _selectedBlobName: string;

    @ViewChild('editor')
    private _editor: EditorComponent = null;

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

    public blobSelectedHandler(blobName: string) {
        this._selectedBlobName = blobName;
    }

    public openBlobPicker(imagesOnly: boolean) {
        this.isBlobPickerActive = true;
        this.isBlobPickerImagesOnly = imagesOnly;
    }

    public cancelBlobPicker() {
        this.isBlobPickerActive = false;
    }

    public selectBlobPicker() {
        // insert blob in editor
        const uri = this.bs.getBlobUriByName(this._selectedBlobName);

        if (this.isBlobPickerImagesOnly) {
            this._editor.exec('insertImage', { src: uri, alt: this._selectedBlobName, title: this._selectedBlobName });
        }
        else {
            this._editor.exec('insertFile', { href: uri, title: this._selectedBlobName });
            this._editor.exec('insertText', { text: this._selectedBlobName });
        }

        this.isBlobPickerActive = false;
    }
}

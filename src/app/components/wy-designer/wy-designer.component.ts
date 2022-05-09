//::Bag::Default
import { Component, Input, ViewEncapsulation, OnInit, AfterViewInit, Inject, OnChanges } from '@angular/core';
import { FormGroupDirective, ControlContainer, FormControl } from '@angular/forms';
import grapesjs from 'grapesjs';
import 'grapesjs-preset-webpage';
@Component({
    selector: 'wy-designer',
    templateUrl: `./wy-designer.component.html`,
    styleUrls: [
        './wy-designer.component.scss',
        './../../../../node_modules/grapesjs/dist/css/grapes.min.css',
        './../../../../node_modules/grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css'
    ],
    viewProviders: [{
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }],
    encapsulation: ViewEncapsulation.None
})
export class WyDesignerComponent implements OnInit, OnChanges, AfterViewInit {
    private _editor: any;
    public formControl: FormControl;
    private _isInitiated = false;
    private _formControlName: string;
    @Input() public entityId: string;
    constructor(private parentForm: FormGroupDirective,
        @Inject('IUtilService')
        private _us: wy.IUtilService) {
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
    ngAfterViewInit() {
        const jwt: any = this._us.getValidatedJwt();
        const appPrefix = jwt.appPrefix;
        let cssControl = this.getCssControl();
        this._editor = this.initializeEditor(this.formControl.value, cssControl.value, appPrefix);
        this._editor.on('storage:start', (e) => {
            let html = this._editor.getHtml();
            let css = this._editor.getCss();
            this.formControl.setValue(html);
            this.formControl.markAsDirty();
            let cssControl = this.getCssControl();
            cssControl.setValue(css);
            cssControl.markAsDirty();
        });
    }
    private getCssControl() {
        return this.parentForm.form.get(this._formControlName + '_Css');
    }
    private initializeEditor(html: string, css: string, prefix: string): any {
        return grapesjs.init({
            container: '#gjs',
            autorender: true,
            forceClass: false,
            components: html + `<style>${css}</style>`,
            height: '100%',
            style: '',
            plugins: ['gjs-preset-webpage'],
            pluginsOpts: {
                'gjs-preset-webpage': {
                    navbarOpts: false,
                    countdownOpts: false,
                    formsOpts: false,
                    blocksBasicOpts: {
                        blocks: ['link-block', 'quote', 'image', 'video', 'text', 'column1', 'column2', 'column3'],
                        flexGrid: false,
                        stylePrefix: prefix + '-'
                    }
                }
            },
            storageManager: {
                type: 'onChange'
            },
            assetManager: {
                embedAsBase64: true
            },
            canvas: {
                styles: [
                ],
                scripts: [
                ]
            }
        });
    }
}

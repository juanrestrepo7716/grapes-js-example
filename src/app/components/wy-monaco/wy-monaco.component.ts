//::Bag::Default
import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MonacoService } from '../../services/monaco.service';
import { DART_LANG, DART_CONF } from './dart-conf';
declare const monaco: any;
@Component({
    selector: 'wy-monaco',
    template: `<div #editor class="wy-monaco-editor-host" [style.height]="getEditorHeight()"></div>`,
    styleUrls: [
        './wy-monaco.component.scss'
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WyMonacoComponent),
            multi: true,
        }
    ]
})
export class WyMonacoComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
    private static configurationApplied: boolean;
    @Input() public language: string;
    @Input() public libraries: any[];
    private _large = false;
    @Input()
    set large(value) {
        this._large = typeof value !== 'undefined' && value !== false
    }
    get large(): boolean {
        return this._large;
    }
    @ViewChild('editor') editorRef: ElementRef;
    private _disposed = false;
    private _editor: any;//monaco.editor.IStandaloneCodeEditor;
    private _disposables: any[] = [];//monaco.IDisposable[] = [];
    private _value: string;
    private _propagateChange = (_: any) => { };
    constructor(
        private _monacoLoader: MonacoService) {
    }
    public getEditorHeight() {
        if (this.large) {
            return 'calc(100vh - 335px)';
        }
        return '150px';
    }
    writeValue(obj: any): void {
        if (obj) {
            this._value = obj;
        }
    }
    registerOnChange(fn: any): void {
        this._propagateChange = fn;
    }
    registerOnTouched(fn: any): void {
    }
    setDisabledState(isDisabled: boolean): void {
    }
    ngAfterViewInit() {
        // Wait until monaco editor is available
        this._monacoLoader.waitForMonaco().then(() => {
            // Need to check if the view has already been destroyed before Monaco was loaded
            if (this._disposed) {
                return;
            }
            this.initMonaco();
        });
    }
    ngOnDestroy() {
        if (this._disposed) {
            return;
        }
        this._disposed = true;
        // Dispose all disposables
        if (this._disposables) {
            for (const disposable of this._disposables) {
                disposable.dispose();
            }
            this._disposables = [];
        }
        // Dispose possibly loaded editor component
        if (this._editor) {
            try {
                this._editor.dispose();
            }
            catch (ex) {
                console.log('Could not dispose editor.', ex);
            }
        }
        this._editor = null;
    }
    initMonaco() {
        // add fixed libs
        this.applyMonacoConfiguration();
        // add dynamic libs
        if (this.libraries) {
            for (const lib of this.libraries) {
                if (this.language == 'typescript') {
                    this._disposables.push(monaco.languages.typescript.typescriptDefaults.addExtraLib(lib.Source, lib.Name + '.ts'));
                }
            }
        }
        // add dart support
        if (this.language == 'dart') {
            monaco.languages.register({
                id: "dart",
                extensions: [".dart"],
                aliases: ["Dart", "dart"],
                mimetypes: ["text/x-dart-source", "text/x-dart"]
            });
            monaco.languages.setMonarchTokensProvider("dart", DART_LANG);
            monaco.languages.setLanguageConfiguration("dart", DART_CONF);
        }
        this._editor = monaco.editor.create(this.editorRef.nativeElement, {
            value: this._value,
            language: this.language
        });
        const model = this._editor.getModel();
        model.onDidChangeContent(() => {
            this._value = model.getValue();
            Promise.resolve(null).then(() => this._propagateChange(this._value));
        });
    }
    applyMonacoConfiguration() {
        if (WyMonacoComponent.configurationApplied) {
            return;
        }
        WyMonacoComponent.configurationApplied = true;
    }
}

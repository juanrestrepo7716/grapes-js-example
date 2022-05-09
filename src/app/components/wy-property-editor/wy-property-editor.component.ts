import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'wy-property-editor',
    templateUrl: './wy-property-editor.component.html',
    styleUrls: [
        './wy-property-editor.component.scss'
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WyPropertyEditorComponent),
            multi: true,
        }
    ]
})
export class WyPropertyEditorComponent implements OnInit, ControlValueAccessor {

    @Input() public orientation: 'horizontal' | 'vertical' = 'horizontal';

    public properties: { [key: string]: string; } = {};
    public isDisabled = false;

    private _propagateChange = (_: any) => { };

    constructor(
    ) { }

    writeValue(obj: any): void {
        if (obj) {
            this.properties = JSON.parse(obj);
        }
    }

    registerOnChange(fn: any): void {
        this._propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    onPropertyChange(key: string, value: any) {
        this.properties[key] = value;
        this._propagateChange(JSON.stringify(this.properties));
    }

    ngOnInit() {
    }

    getPropertyTitle(key: string) {
        return key.replace(/([A-Z])/g, ' $1').trim();
    }
}

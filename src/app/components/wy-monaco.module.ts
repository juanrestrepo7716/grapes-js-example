import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyMonacoComponent } from './wy-monaco/wy-monaco.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        WyMonacoComponent
    ],
    exports: [
        WyMonacoComponent
    ]
})
export class WyMonacoModule { }

import { Directive, Input, OnChanges, OnInit } from '@angular/core';
import { ColumnComponent } from '@progress/kendo-angular-grid';

@Directive({
    selector: '[wyGridColumn]'
})
export class WyGridColumnDirective implements OnChanges {

    @Input() gcd: wy.IWyGridColumnDefinition;

    constructor(private column: ColumnComponent) {
    }

    ngOnChanges() {
        if (this.gcd.minColWidth) {
            this.column.minResizableWidth = +this.gcd.minColWidth;
        }

        if (this.gcd.width) {
            this.column.width = +this.gcd.width;
        }

        this.column.media = this.gcd.media;
        this.column.format = this.gcd.format;
        this.column.field = this.gcd.field;
        this.column.filter = this.gcd.filter as 'text' | 'numeric' | 'boolean' | 'date';
        this.column.filterable = this.gcd.filter != '';
    }
}

import { Directive, Input } from '@angular/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

@Directive({
    selector: '[wyGrid]'
})
export class WyGridDirective {

    @Input() state: State;

    constructor(private grid: GridComponent) {
        grid.sortable = true;
        grid.reorderable = true;
        grid.selectable = true;
        grid.resizable = true;
        grid.navigable = true;
        grid.scrollable = 'none';
        grid.sortable = true;
        grid.pageable = true;
    }
}

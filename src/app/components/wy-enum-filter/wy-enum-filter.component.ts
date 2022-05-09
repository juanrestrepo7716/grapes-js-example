import { Component, Input, TemplateRef } from '@angular/core';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { FilterService, BaseFilterCellComponent } from '@progress/kendo-angular-grid';

@Component({
    selector: 'wy-enum-filter',
    templateUrl: './wy-enum-filter.component.html',
    styleUrls: [
        './wy-enum-filter.component.scss'
    ]
})
export class WyEnumFilterComponent extends BaseFilterCellComponent {

    public get selectedValue(): any {
        const filter = this.filterByField(this.valueField);
        return filter ? filter.value : null;
    }

    @Input() public filter: CompositeFilterDescriptor;
    @Input() public data: any[];
    @Input() public valueField: string;
    @Input() public filterField: string;
    @Input() public enumValueTemplate: TemplateRef<any>;

    public get defaultItem(): any {
        return {
            [this.valueField]: null
        };
    }

    constructor(filterService: FilterService) {
        super(filterService);
    }

    public onChange(value: any): void {
        this.applyFilter(
            value === null ?
                this.removeFilter(this.filterField) :
                this.updateFilter({
                    field: this.filterField,
                    operator: 'eq',
                    value: value
                })
        );
    }
}

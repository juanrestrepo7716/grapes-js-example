import { Component, Input, Inject, OnInit } from '@angular/core';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { FilterService, BaseFilterCellComponent } from '@progress/kendo-angular-grid';

@Component({
    selector: 'wy-lookup-filter',
    templateUrl: './wy-lookup-filter.component.html',
    styleUrls: [
        './wy-lookup-filter.component.scss'
    ]
})
export class WyLookupFilterComponent extends BaseFilterCellComponent implements OnInit {

    public get selectedValue(): any {
        const filter = this.filterByField(this.valueField);
        return filter ? filter.value : null;
    }

    @Input() public filter: CompositeFilterDescriptor;
    @Input() public dataStoreName: string;
    @Input() public dataSourceUri: string;
    @Input() public textField: string;
    @Input() public valueField: string;
    @Input() public filterField: string;

    public lookupEntityData: any[];
    public filteredLookupEntityData: any[];

    public get defaultItem(): any {
        return {
            [this.textField]: '-',
            [this.valueField]: null
        };
    }

    constructor(filterService: FilterService,

        @Inject('IDataService')
        private _ds: wy.IDataService) {
        super(filterService);
    }

    async ngOnInit() {
        const data = await this._ds.fetch(this.dataStoreName, this.dataSourceUri).toPromise();
        this.lookupEntityData = data;
        this.filteredLookupEntityData = data;
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

    public filterChange(filter: any): void {
        this.filteredLookupEntityData = this.lookupEntityData.filter(
            (item) => {
                if (!item) {
                    return false;
                }

                if (!item[this.textField]) {
                    return false;
                }

                return item[this.textField].toLowerCase().indexOf(filter.toLowerCase()) !== -1;
            });
    }
}

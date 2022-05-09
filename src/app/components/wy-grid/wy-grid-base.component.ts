//::Bag::Default
import { OnInit, ViewChild, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter, AfterViewInit, Directive } from '@angular/core';
import { GroupDescriptor, SortDescriptor, process, DataResult, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { GridComponent, RowClassArgs, RowArgs, PageChangeEvent, RemoveEvent, CellClickEvent } from '@progress/kendo-angular-grid';
import { WyBaseComponent } from '../wy-base.component';
import { WyOneEntityBaseComponent } from '../wy-one-entity/wy-one-entity-base.component';
import { WyQuickSearchComponent } from '../wy-quick-search/wy-quick-search.component';
import { ToolbarActionType } from './wy-grid-toolbar.component';
import { GridColumnsConfigurationStorageKey, PageSizeStorageKey, PRIMARY_KEY_NULL_VALUE, QuickSearchStorageKey, SortStorageKey } from '../constants';
import * as flatten from 'flat';
import { FormGroup } from '@angular/forms';
export interface IEntityGridAction {
    name: string;
    pictureUrl?: string;
    confirmationMessage?: string;
    entityOrderPropertyName?: string;
    disabled: boolean;
}
export interface ILeafClassDropDownButton {
    name: string;
    disabled: boolean;
    click: any;
}
@Directive()
export abstract class WyGridBaseComponent extends WyBaseComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    private dataResult: wy.IDataResult; // contains original data
    public gridDataResult: wy.IDataResult; // contains data as shown in grid
    public state: wy.IDataState = {
        sort: [],
        skip: 0,
        take: 10
    };
    public groups: GroupDescriptor[] = [];
    private _isInitiated = false;
    @ViewChild('oneEntity', { static: false })
    oneEntityComponent: WyOneEntityBaseComponent;
    @ViewChild(GridComponent, { static: false })
    grid: GridComponent;
    @ViewChild('quickSearch', { static: false })
    quickSearch: WyQuickSearchComponent;
    public quickSearchStorageKey: string;
    @Input() public filter: string;
    @Input() public newEntityDefaults: wy.BaseEntity;
    @Input() public newEntityOwner: FormGroup;
    @Input() public newEntityOwnerClassName: string;
    @Input() public showToolbar: boolean | 'Simple' = true;
    @Input() public showQuickSearch = true;
    @Input() public showHierarchy = true;
    @Input() public gridViewMode: 'Columns' | 'Cards' = 'Columns';
    @Input() public asRecycleBin: boolean;
    @Output() afterQuickSearchChange: EventEmitter<any> = new EventEmitter();
    public selectedEntity: wy.BaseEntity;
    public selectedAsReadonly: boolean;
    public selectedEntityKind: string;
    public selectedEntityIsNew: boolean;
    public pivotReport: any;
    public gridConfigurationActive: boolean;
    public recycleBinActive: boolean;
    public loading = true;
    public filterable: boolean;
    public groupable: boolean;
    public dialogWidth: number;
    public dialogHeight: number;
    protected originalGridConfiguration: any = {};
    public updateId: string;
    protected autoRefreshProcessHandle: any;
    /**
     * Grid column configuration. (what end user can change)
     */
    public abstract gcc: any;
    /**
     * Grid column definition. (what end user cannot change)
     */
    public abstract gcd: any;
    public abstract addNewEntity(selectedEntityKind?: string): void;
    protected abstract getDataStoreName(): string;
    protected abstract getReadDataSourceUri(): string;
    protected abstract getWriteDataSourceUri(): string;
    protected abstract getQuickSearchFields(): string[];
    protected abstract getExpandNavigationProperties(): string[];
    protected abstract getComponentIdentifier(): string;
    public abstract getClassName(entity: wy.BaseEntity): string;
    constructor(
        protected azs: wy.IAuthorizationService,
        protected usrSet: wy.IUserSettingsService,
        protected ds: wy.IDataService,
        protected ls: wy.ILanguageService,
        protected bs: wy.IBlobService,
        protected st: wy.IStorageService,
        protected us: wy.IUtilService) {
        super();
        this.selectedEntity = null;
        this.quickSearchStorageKey = this.st.getComponentStorageKey(this.getComponentIdentifier(), QuickSearchStorageKey);
        if (window.innerWidth > 992 && window.innerHeight > 720) {
            this.dialogWidth = window.innerWidth - 300;
            this.dialogHeight = window.innerHeight - 100;
        }
        else {
            this.dialogWidth = window.innerWidth - 10;
            this.dialogHeight = window.innerHeight - 10;
        }
    }
    public getCurrency() {
        return this.usrSet.getCurrency();
    }
    public isFeatureEnabled(featureKey: string) {
        if (this.azs.isFeatureEnabled(featureKey)) {
            return this.usrSet.isFeatureEnabled(featureKey);
        }
        return false;
    }
    public isThisEntitySelected = (e: RowArgs) => this.selectedEntity?.Id == e.dataItem?.Id;
    public getShowHierarchy = () => this.showHierarchy;
    protected getClassNameByODataType(entity: wy.BaseEntity) {
        const type = entity['@odata.type'];
        if (type) {
            const parts = type.split('.');
            return parts[parts.length - 1];
        }
        return null;
    }
    // pivot
    public async openPivot() {
        const expandNavigationProperties = this.getExpandNavigationProperties();
        const expand = this.ds.getExpandExpression(expandNavigationProperties);
        const mergedFilter = this.getMergedFilter();
        let data = await this.ds.fetch(
            this.getDataStoreName(),
            this.getReadDataSourceUri(),
            mergedFilter,
            expand
        ).toPromise();
        const flatData = [];
        for (let entity of data) {
            let flatEntity = flatten(entity, {
                delimiter: '_'
            });
            flatData.push(flatEntity);
        }
        console.log(flatData);
        this.pivotReport = {
            dataSource: {
                data: flatData
            }
        };
    }
    public closePivot() {
        this.pivotReport = null;
    }
    // recycle bin
    public openRecycleBin() {
        this.recycleBinActive = true;
    }
    public closeRecycleBin() {
        this.recycleBinActive = false;
        this.read();
    }
    // grid configuration
    public openGridConfiguration() {
        this.clearSelection();
        this.gridConfigurationActive = true;
    }
    public saveGridConfiguration() {
        const key = this.st.getComponentStorageKey(this.getComponentIdentifier(), GridColumnsConfigurationStorageKey);
        this.st.setValue(key, this.gcc);
        this.gridConfigurationActive = false;
    }
    protected loadGridConfiguration() {
        this.originalGridConfiguration = this.cloneObject(this.gcc);
        const key = this.st.getComponentStorageKey(this.getComponentIdentifier(), GridColumnsConfigurationStorageKey);
        const gcc = this.st.getValue(key);
        if (gcc) {
            Object.assign(this.gcc, gcc);
        }
    }
    protected closeGridConfiguration() {
        this.gridConfigurationActive = false;
    }
    protected resetGridConfiguration() {
        this.gcc = this.cloneObject(this.originalGridConfiguration);
        const key = this.st.getComponentStorageKey(this.getComponentIdentifier(), GridColumnsConfigurationStorageKey);
        this.st.clearValue(key);
        this.gridConfigurationActive = false;
    }
    // group
    public groupChange(groups: GroupDescriptor[]): void {
        this.groups = groups;
        this.applyGroups();
    }
    private applyGroups() {
        this.gridDataResult = {
            data: process(this.dataResult.data, { group: this.groups }).data,
            total: this.dataResult.total
        };
    }
    // filter
    public filterChangeHandler(filter: CompositeFilterDescriptor): void {
        this.state.filter = filter;
        this.read();
    }
    public toggleFilter() {
        this.filterable = !this.filterable;
        if (!this.filterable) {
            // clear filter(s)
            this.state.filter = null;
            this.read();
        }
    }
    public toggleGroupBy() {
        this.groupable = !this.groupable;
    }
    // sort
    public sortChangeHandler(sort: SortDescriptor[]) {
        this.state.sort = sort;
        this.read();
        this.saveSort();
    }
    protected saveSort() {
        const key = this.st.getComponentStorageKey(this.getComponentIdentifier(), SortStorageKey);
        this.st.setValue(key, this.state.sort);
    }
    protected loadSort() {
        const key = this.st.getComponentStorageKey(this.getComponentIdentifier(), SortStorageKey);
        const sort = this.st.getValue(key);
        if (sort) {
            this.state.sort = sort;
        }
    }
    // quick search
    public quickSearchChangeHandler(search: string) {
        this.state.skip = 0;
        this.read();
        this.afterQuickSearchChange.emit({
            search: search
        });
    }
    // page size
    public pageChangeHandler(page: PageChangeEvent): void {
        this.state.take = page.take;
        this.state.skip = page.skip;
        this.read();
    }
    protected savePageSize() {
        const key = this.st.getComponentStorageKey(this.getComponentIdentifier(), PageSizeStorageKey);
        this.st.setValue(key, this.state.take.toString());
    }
    protected loadPageSize() {
        const key = this.st.getComponentStorageKey(this.getComponentIdentifier(), PageSizeStorageKey);
        const pageSize = this.st.getValue(key);
        if (pageSize) {
            this.state.take = +pageSize;
        }
    }
    public cloneObject(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }
    protected getMergedFilter() {
        const recycleBinFilter = this.asRecycleBin ? this.ds.getInRecycleBinFilter() : this.ds.getNotInRecycleBinFilter();
        const quickSearchFilter = this.quickSearch
            ? this.quickSearch.getFilterFromQuickSearch(this.getQuickSearchFields())
            : null;
        const configuredFilter = this.filter;
        let mergedFilter = recycleBinFilter;
        mergedFilter = this.ds.mergeFilters(mergedFilter, quickSearchFilter);
        mergedFilter = this.ds.mergeFilters(mergedFilter, configuredFilter);
        return mergedFilter;
    }
    ngOnInit(): void {
        this.loadPageSize();
        this.loadGridConfiguration();
        this.loadSort();
    }
    async ngAfterViewInit() {
        await this.read();
        this._isInitiated = true;
    }
    async ngOnChanges(changes: SimpleChanges) {
        if (this._isInitiated) {
            await this.read();
        }
    }
    ngOnDestroy() {
        if (this.autoRefreshProcessHandle) {
            clearInterval(this.autoRefreshProcessHandle);
        }
    }
    public onToolbarAction(action: ToolbarActionType) {
        if (action == ToolbarActionType.OpenGridConfiguration) {
            this.openGridConfiguration();
            return;
        }
        if (action == ToolbarActionType.ToggleFilter) {
            this.toggleFilter();
            return;
        }
        if (action == ToolbarActionType.ToggleGroupBy) {
            this.toggleGroupBy();
            return;
        }
        if (action == ToolbarActionType.ExportExcel) {
            this.grid.saveAsExcel();
            return;
        }
        if (action == ToolbarActionType.ExportPDF) {
            this.grid.saveAsPDF();
            return;
        }
        if (action == ToolbarActionType.OpenPivot) {
            this.openPivot();
            return;
        }
        if (action == ToolbarActionType.OpenRecycleBin) {
            this.openRecycleBin();
            return;
        }
        if (action == ToolbarActionType.SwitchGridViewMode) {
            if (this.gridViewMode == 'Cards') {
                this.gridViewMode = 'Columns';
            }
            else {
                this.gridViewMode = 'Cards';
            }
            return;
        }
    }
    public copyEntity(entity: wy.BaseEntity) {
        if (entity) {
            const newEntity = {} as any;
            Object.assign(newEntity, entity);
            newEntity.Id = PRIMARY_KEY_NULL_VALUE;
            this.selectedEntityKind = this.getEntityKind(newEntity);
            this.selectedEntity = newEntity;
            this.selectedAsReadonly = false;
            this.selectedEntityIsNew = true;
        }
    }
    public cellClickHandler(event: CellClickEvent) {
        const entity = event.dataItem as wy.BaseEntity;
        if (entity) {
            this.selectEntity(entity);
        }
    }
    private clearSelection() {
        this.selectedEntity = null;
        this.selectedEntityIsNew = false;
        this.selectedAsReadonly = false;
        this.selectedEntityKind = null;
    }
    public selectEntity(entity: wy.BaseEntity, readonly: boolean = false) {
        if (entity.Id == this.selectedEntity?.Id) {
            this.clearSelection();
            return;
        }
        if (entity.DeleteStatus == 1) {
            return; // cannot select in trash
        }
        if (!readonly && this.isFeatureEnabled('Edit_' + this.getClassName(entity))) {
            this.selectedEntity = entity;
            this.selectedEntityIsNew = false;
            this.selectedAsReadonly = false;
            this.selectedEntityKind = this.getEntityKind(entity);
        }
        else if (this.isFeatureEnabled('View_' + this.getClassName(entity))) {
            this.selectedEntity = entity;
            this.selectedEntityIsNew = false;
            this.selectedAsReadonly = true;
            this.selectedEntityKind = this.getEntityKind(entity);
        }
    }
    private getEntityKind(entity: wy.BaseEntity) {
        const type = entity['@odata.type'];
        if (type) {
            const parts = type.split('.');
            return parts[parts.length - 1];
        }
        return null;
    }
    public saveEntityHandler(event: wy.ISaveEvent) {
        this.oneEntityComponent.saveEntity((success, entity) => {
            if (success) {
                if (event.close) {
                    this.cancelEntityHandler();
                }
                this.read();
            }
        });
    }
    public cancelEntityHandler() {
        this.clearSelection();
    }
    public getSelectedEntityId(): wy.PrimaryKey {
        if (this.selectedEntity != null) {
            return this.selectedEntity.Id;
        }
        return null;
    }
    protected async read() {
        this.savePageSize();
        const expandNavigationProperties = this.getExpandNavigationProperties();
        const expand = this.ds.getExpandExpression(expandNavigationProperties);
        const mergedFilter = this.getMergedFilter();
        this.loading = true;
        try {
            this.dataResult = await this.ds.fetchData(this.getDataStoreName(),
                this.getReadDataSourceUri(),
                mergedFilter,
                expand,
                this.state
            ).toPromise();
            this.applyGroups();
            this.updateId = uuid.v4();
        }
        finally {
            this.loading = false;
        }
    }
    public async removeEntity(entity: wy.BaseEntity) {
        if (!entity.DeleteStatus) {
            if (confirm(this.ls.translate('DeleteConfirmation'))) {
                await this.ds.remove(this.getDataStoreName(), this.getWriteDataSourceUri(), entity).toPromise();
                this.read();
            }
        }
        else {
            if (confirm(this.ls.translate('RecycleBinRestoreConfirmation'))) {
                await this.ds.restore(this.getDataStoreName(), this.getWriteDataSourceUri(), entity).toPromise();
                this.read();
            }
        }
    }
    public async triggerOperation(entity: wy.BaseEntity, operationName: string, pictureUrl: string, confirmationMessage: string) {
        if (entity && this.us.isValidEntityId(entity.Id)) {
            this.clearSelection();
            if (!confirmationMessage || confirm(confirmationMessage)) {
                await this.ds.triggerOperation(this.getDataStoreName(), this.getWriteDataSourceUri(), operationName, entity.Id, null, pictureUrl).toPromise();
                this.read();
            }
        }
    }
    public triggerEntityGridAction(entity: wy.BaseEntity, entityGridAction: IEntityGridAction, rowIndex: number) {
        if (entity && entityGridAction) {
            if (entityGridAction.name == '$delete') {
                this.removeEntity(entity);
            }
            else if (entityGridAction.name == '$copy') {
                this.copyEntity(entity);
            }
            else if (entityGridAction.name == '$moveUp') {
                this.moveRow(entityGridAction.entityOrderPropertyName, rowIndex, true);
            }
            else if (entityGridAction.name == '$moveDown') {
                this.moveRow(entityGridAction.entityOrderPropertyName, rowIndex, false);
            }
            else {
                this.triggerOperation(entity, entityGridAction.name, entityGridAction.pictureUrl, entityGridAction.confirmationMessage);
            }
        }
    }
    public getBlobUri(blobName: string) {
        return this.bs.getBlobUriByName(blobName);
    }
    public rowClassCallback = (context: RowClassArgs) => {
        if (context.dataItem.DeleteStatus == 1) {
            return { 'wy-removed': true };
        }
    }
    // google maps location
    public getGoogleMapsLocation(lat: string, lng: string) {
        return `https://maps.google.com/maps?daddr=${lat},${lng}`;
    }
    // move row up/down, orderable entities
    public async moveRow(propertyName: string, rowIndex: number, up: boolean) {
        const diff = 10;
        const viewRowIndex = (rowIndex - this.state.skip);
        const dataItems = this.grid.data as DataResult;
        console.log(viewRowIndex);
        for (let i = 0; i < dataItems.data.length; i++) {
            const item = dataItems.data[i];
            let order = ((this.state.skip + i + 1) * diff);
            if (i == viewRowIndex) {
                if (up) {
                    order = order - (diff + 5);
                }
                else {
                    order = order + (diff + 5);
                }
            }
            // update only order property
            const updateEntity: wy.BaseEntity = {
                Id: item.Id
            };
            updateEntity[propertyName] = order;
            // TODO: use batch update
            await this.ds.save(this.getDataStoreName(), this.getWriteDataSourceUri(), updateEntity, false, true).toPromise();
        }
        // refresh grid
        await this.read();
    }
    public getEntityTooltip(entity: wy.BaseEntity): string {
        if (!entity) {
            return '-';
        }
        const className = this.getClassName(entity);
        let tooltip = `${className}\n${entity.Id}`;
        if (entity['Name']) {
            tooltip += `\n${entity['Name']}`;
        }
        return tooltip;
    }
}

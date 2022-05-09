//::Bag::Default
import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, OnInit, Inject } from '@angular/core';
export enum ToolbarActionType {
    OpenGridConfiguration = 1,
    ToggleFilter = 2,
    ToggleGroupBy = 3,
    ExportExcel = 4,
    ExportPDF = 5,
    SwitchGridViewMode = 6,
    OpenPivot = 7,
    OpenRecycleBin = 8,
}
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'wy-grid-toolbar',
    templateUrl: './wy-grid-toolbar.component.html',
    styleUrls: [
        './wy-grid-toolbar.component.scss'
    ]
})
export class WyGridToolbarComponent implements OnInit, OnChanges {
    toolbarActionType = ToolbarActionType;
    @Input() public showNew: boolean;
    @Input() public showToolbar: boolean | 'Simple' = true;
    @Input() public showGridViewMode: boolean;
    @Input() public gridViewMode: 'Columns' | 'Cards';
    @Output() onAction: EventEmitter<ToolbarActionType> = new EventEmitter();
    public primaryToolbarItems: any[];
    public secondaryToolbarItems: any[];
    constructor(
        @Inject('IAuthorizationService')
        private _azs: wy.IAuthorizationService,
        @Inject('IUserSettingsService')
        private _usrSet: wy.IUserSettingsService) {
    }
    ngOnInit() {
        this.initToolbarItems();
    }
    ngOnChanges() {
        this.initToolbarItems();
    }
    private initToolbarItems() {
        this.primaryToolbarItems = [];
        this.secondaryToolbarItems = [];
        if (this.gridViewMode == 'Columns') {
            if (this.isFeatureEnabled('Common_GridConfiguration')) {
                this.primaryToolbarItems.push({
                    action: this.toolbarActionType.OpenGridConfiguration
                });
            }
            if (this.isFeatureEnabled('Common_GridFilter')) {
                this.primaryToolbarItems.push({
                    action: this.toolbarActionType.ToggleFilter
                });
            }
            if (this.isFeatureEnabled('Common_GridGroupBy')) {
                this.primaryToolbarItems.push({
                    action: this.toolbarActionType.ToggleGroupBy
                });
            }
        }
        else {
            this.primaryToolbarItems = [];
        }
        if (this.gridViewMode == 'Columns') {
            if (this.isFeatureEnabled('Common_ExportExcel')) {
                this.secondaryToolbarItems.push({
                    action: this.toolbarActionType.ExportExcel
                });
            }
            if (this.isFeatureEnabled('Common_ExportPDF')) {
                this.secondaryToolbarItems.push({
                    action: this.toolbarActionType.ExportPDF
                });
            }
        }
    }
    public isFeatureEnabled(featureKey: string) {
        if (this._azs.isFeatureEnabled(featureKey)) {
            return this._usrSet.isFeatureEnabled(featureKey);
        }
        return false;
    }
    public triggerAction(action: ToolbarActionType) {
        this.onAction.emit(action);
    }
}

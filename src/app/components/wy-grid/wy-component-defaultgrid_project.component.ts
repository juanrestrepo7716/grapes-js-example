import { Component, Inject, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { IEntityGridAction, ILeafClassDropDownButton, WyGridBaseComponent } from '../wy-grid/wy-grid-base.component';
import { PRIMARY_KEY_NULL_VALUE } from '../constants';
import { DynamicObjectExpressionApi } from '../types';
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'wy-component-defaultgrid_project',
    templateUrl: './wy-component-defaultgrid_project.component.html',
    styleUrls: [
        './wy-grid.component.scss'
    ]
})
export class WyGridComponent_DefaultGrid_Project extends WyGridBaseComponent implements AfterViewInit, OnDestroy {
    public leafClassesDropDownButtons: ILeafClassDropDownButton[] = [
    ];
    public entityGridActionsDropDownButtons: IEntityGridAction[] = [
        {
            name: '$delete',
            disabled: !this.isFeatureEnabled('Delete_Project')
        },
        {
            name: '$copy',
            disabled: !this.isFeatureEnabled('Copy_Project')
        },
    ];
    public gcc: any = {
        '@odata.type': {
            visible: true,
        },
        'Id': {
            visible: false,
        },
        'Name': {
            visible: true,
        },
        'Notes': {
            visible: false,
        },
        'Status': {
            visible: true,
        },
        'CreatedBy': {
            visible: true,
        },
        'Picture': {
            visible: true,
        },
        'ProjectLocation': {
            visible: true,
        },
        'TodoItems': {
            visible: false,
        },
        'Comments': {
            visible: false,
        },
        'PdfDocument': {
            visible: false,
        },
        'ProjectFiles': {
            visible: false,
        },
    };
    public gcd: any = {
        '@odata.type': {
            minColWidth: '75',
        },
        'Id': {
            minColWidth: '50',
        },
        'Name': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 0px)',
            field: 'Name',
            format: '',
            filter: 'text',
        },
        'Notes': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 0px)',
            field: 'Notes',
            format: '',
            filter: 'text',
        },
        'Status': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 992px)',
            field: 'Status',
            format: '{0:n0}',
            filter: 'numeric',
        },
        'CreatedBy': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 992px)',
            field: 'CreatedBy',
            format: '',
            filter: 'text',
        },
        'Picture': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 768px)',
            field: 'Picture',
            format: '',
            filter: 'text',
        },
        'ProjectLocation': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 768px)',
            field: 'ProjectLocation',
            format: '{0:n0}',
            filter: 'numeric',
        },
        'TodoItems': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 768px)',
            field: 'TodoItems',
            format: '',
            filter: 'text',
        },
        'Comments': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 768px)',
            field: 'Comments',
            format: '',
            filter: 'text',
        },
        'PdfDocument': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 0px)',
            field: 'PdfDocument',
            format: '',
            filter: 'text',
        },
        'ProjectFiles': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 0px)',
            field: 'ProjectFiles',
            format: '',
            filter: 'text',
        },
    };
    // bindings for enum
    public properties: any = {
        'Status': {
            enum: [
                {
                    value: +'2'
                },
                {
                    value: +'0'
                },
                {
                    value: +'1'
                },
            ],
        },
        'ProjectLocation': {
            enum: [
                {
                    value: +'3'
                },
                {
                    value: +'2'
                },
                {
                    value: +'1'
                },
                {
                    value: +'0'
                },
            ],
        },
    }
    constructor(
        @Inject('IAuthorizationService')
        azs: wy.IAuthorizationService,
        @Inject('IUserSettingsService')
        usrSet: wy.IUserSettingsService,
        @Inject('IDataService')
        ds: wy.IDataService,
        @Inject('ILanguageService')
        ls: wy.ILanguageService,
        @Inject('IBlobService')
        bs: wy.IBlobService,
        @Inject('IStorageService')
        st: wy.IStorageService,
        @Inject('IUtilService')
        us: wy.IUtilService
    ) {
        super(azs, usrSet, ds, ls, bs, st, us);
    }
    async ngAfterViewInit() {
        await super.ngAfterViewInit();
    }
    ngOnDestroy() {
        if (this.autoRefreshProcessHandle) {
            clearInterval(this.autoRefreshProcessHandle);
        }
    }
    public getClassName(entity: wy.BaseEntity): string {
        return this.getClassNameByODataType(entity) || 'Project';
    }
    protected getDataStoreName(): string {
        return 'default';
    }
    protected getReadDataSourceUri(): string {
        return '/Projects';
    }
    protected getWriteDataSourceUri(): string {
        return '/Projects';
    }
    protected getComponentIdentifier(): string {
        return 'wy-component-defaultgrid_project';
    }
    protected getExpandNavigationProperties(): string[] {
        const result: string[] = [];
        return result;
    }
    protected getQuickSearchFields(): string[] {
        const result: string[] = [];
        result.push('Name');
        return result;
    }
    public addNewEntity(selectedEntityKind?: string) {
        let newEntity = null;
        const exp = new DynamicObjectExpressionApi(null, this.newEntityOwner, selectedEntityKind || 'Project', this.newEntityOwnerClassName, this.usrSet); // TODO: support owner entity
        if (!newEntity) {
            newEntity = {
                Id: PRIMARY_KEY_NULL_VALUE,
                            Status: 0,
                            ProjectLocation: 0,
                        PdfDocument: uuid.v4(),
                        PdfDocument_Count: 0,
                        ProjectFiles: uuid.v4(),
                        ProjectFiles_Count: 0,
            };
        }
        Object.assign(newEntity, this.newEntityDefaults);
        this.selectedEntityKind = selectedEntityKind;
        this.selectedEntity = newEntity;
        this.selectedAsReadonly = false;
        this.selectedEntityIsNew = true;
    }
}

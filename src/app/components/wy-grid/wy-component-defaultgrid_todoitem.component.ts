import { Component, Inject, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { IEntityGridAction, ILeafClassDropDownButton, WyGridBaseComponent } from '../wy-grid/wy-grid-base.component';
import { PRIMARY_KEY_NULL_VALUE } from '../constants';
import { DynamicObjectExpressionApi } from '../types';
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'wy-component-defaultgrid_todoitem',
    templateUrl: './wy-component-defaultgrid_todoitem.component.html',
    styleUrls: [
        './wy-grid.component.scss'
    ]
})
export class WyGridComponent_DefaultGrid_TodoItem extends WyGridBaseComponent implements AfterViewInit, OnDestroy {
    public leafClassesDropDownButtons: ILeafClassDropDownButton[] = [
            {
                name: 'Action',
                disabled: !this.isFeatureEnabled('Add_Action'),
                click: (dataItem) => {
                    this.addNewEntity(dataItem.name);
                }
            },
            {
                name: 'Message',
                disabled: !this.isFeatureEnabled('Add_Message'),
                click: (dataItem) => {
                    this.addNewEntity(dataItem.name);
                }
            },
    ];
    public entityGridActionsDropDownButtons: IEntityGridAction[] = [
        {
            name: '$delete',
            disabled: !this.isFeatureEnabled('Delete_TodoItem')
        },
        {
            name: '$copy',
            disabled: !this.isFeatureEnabled('Copy_TodoItem')
        },
            {
                name: 'Finish',
                pictureUrl: '',
                confirmationMessage: '',
                disabled: !this.isFeatureEnabled('Operation_Finish')
            },
            {
                name: 'Error',
                pictureUrl: '',
                confirmationMessage: '',
                disabled: !this.isFeatureEnabled('Operation_Error')
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
        'Priority': {
            visible: true,
        },
        'Pictures': {
            visible: true,
        },
        'Created': {
            visible: true,
        },
        'Finished': {
            visible: true,
        },
        'Owner': {
            visible: false,
        },
        'Project': {
            visible: false,
        },
        'Comments': {
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
        'Priority': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 992px)',
            field: 'Priority',
            format: '{0:n0}',
            filter: 'numeric',
        },
        'Pictures': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 992px)',
            field: 'Pictures',
            format: '',
            filter: 'text',
        },
        'Created': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 768px)',
            field: 'Created',
            format: '{0:g}',
            filter: 'date',
        },
        'Finished': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 768px)',
            field: 'Finished',
            format: '',
            filter: 'boolean',
        },
        'Owner': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 0px)',
            field: 'OwnerId',
            format: '',
            filter: 'numeric',
        },
        'Project': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 0px)',
            field: 'ProjectId',
            format: '',
            filter: 'numeric',
        },
        'Comments': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 0px)',
            field: 'Comments',
            format: '',
            filter: 'text',
        },
    };
    // bindings for enum
    public properties: any = {
        'Priority': {
            enum: [
                {
                    value: +'0'
                },
                {
                    value: +'2'
                },
                {
                    value: +'1'
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
        this.groups = [{ 'field': 'OwnerId' }];
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
        return this.getClassNameByODataType(entity) || 'TodoItem';
    }
    protected getDataStoreName(): string {
        return 'default';
    }
    protected getReadDataSourceUri(): string {
        return '/TodoItems';
    }
    protected getWriteDataSourceUri(): string {
        return '/TodoItems';
    }
    protected getComponentIdentifier(): string {
        return 'wy-component-defaultgrid_todoitem';
    }
    protected getExpandNavigationProperties(): string[] {
        const result: string[] = [];
        result.push('Owner');
        result.push('Project');
        return result;
    }
    protected getQuickSearchFields(): string[] {
        const result: string[] = [];
        result.push('Name');
        return result;
    }
    public addNewEntity(selectedEntityKind?: string) {
        let newEntity = null;
        const exp = new DynamicObjectExpressionApi(null, this.newEntityOwner, selectedEntityKind || 'TodoItem', this.newEntityOwnerClassName, this.usrSet); // TODO: support owner entity
        if (selectedEntityKind == 'Action') {
            newEntity = {
                Id: PRIMARY_KEY_NULL_VALUE,
                            Priority: 0,
                        Pictures: uuid.v4(),
                        Pictures_Count: 0,
                            Created: null,
                            Finished: false,
            };
        }
        if (selectedEntityKind == 'Message') {
            newEntity = {
                Id: PRIMARY_KEY_NULL_VALUE,
                            Priority: 0,
                        Pictures: uuid.v4(),
                        Pictures_Count: 0,
                            Created: null,
                            Finished: false,
            };
        }
        if (!newEntity) {
            newEntity = {
                Id: PRIMARY_KEY_NULL_VALUE,
                            Priority: 0,
                        Pictures: uuid.v4(),
                        Pictures_Count: 0,
                            Created: null,
                            Finished: false,
            };
        }
        Object.assign(newEntity, this.newEntityDefaults);
        this.selectedEntityKind = selectedEntityKind;
        this.selectedEntity = newEntity;
        this.selectedAsReadonly = false;
        this.selectedEntityIsNew = true;
    }
}

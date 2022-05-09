import { Component, Inject, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { IEntityGridAction, ILeafClassDropDownButton, WyGridBaseComponent } from '../wy-grid/wy-grid-base.component';
import { PRIMARY_KEY_NULL_VALUE } from '../constants';
import { DynamicObjectExpressionApi } from '../types';
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'wy-component-defaultgrid_user',
    templateUrl: './wy-component-defaultgrid_user.component.html',
    styleUrls: [
        './wy-grid.component.scss'
    ]
})
export class WyGridComponent_DefaultGrid_User extends WyGridBaseComponent implements AfterViewInit, OnDestroy {
    public leafClassesDropDownButtons: ILeafClassDropDownButton[] = [
    ];
    public entityGridActionsDropDownButtons: IEntityGridAction[] = [
        {
            name: '$delete',
            disabled: !this.isFeatureEnabled('Delete_User')
        },
        {
            name: '$copy',
            disabled: !this.isFeatureEnabled('Copy_User')
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
        'EmailAddress': {
            visible: true,
        },
        'Picture': {
            visible: true,
        },
        'Color': {
            visible: true,
        },
        'Description': {
            visible: true,
        },
        'Enabled': {
            visible: false,
        },
        'Attachment': {
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
        'EmailAddress': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 992px)',
            field: 'EmailAddress',
            format: '',
            filter: 'text',
        },
        'Picture': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 992px)',
            field: 'Picture',
            format: '',
            filter: 'text',
        },
        'Color': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 768px)',
            field: 'Color',
            format: '',
            filter: 'text',
        },
        'Description': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 768px)',
            field: 'Description',
            format: '',
            filter: 'text',
        },
        'Enabled': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 0px)',
            field: 'Enabled',
            format: '',
            filter: 'boolean',
        },
        'Attachment': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 0px)',
            field: 'Attachment',
            format: '',
            filter: 'text',
        },
    };
    // bindings for enum
    public properties: any = {
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
        return this.getClassNameByODataType(entity) || 'User';
    }
    protected getDataStoreName(): string {
        return 'default';
    }
    protected getReadDataSourceUri(): string {
        return '/Users';
    }
    protected getWriteDataSourceUri(): string {
        return '/Users';
    }
    protected getComponentIdentifier(): string {
        return 'wy-component-defaultgrid_user';
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
        const exp = new DynamicObjectExpressionApi(null, this.newEntityOwner, selectedEntityKind || 'User', this.newEntityOwnerClassName, this.usrSet); // TODO: support owner entity
        if (!newEntity) {
            newEntity = {
                Id: PRIMARY_KEY_NULL_VALUE,
                        Picture_Size: 0,
                        Picture_PosX: 0,
                        Picture_PosY: 0,
                            Color: "#0000ff",
                            Enabled: false,
                        Attachment_Size: 0,
            };
        }
        Object.assign(newEntity, this.newEntityDefaults);
        this.selectedEntityKind = selectedEntityKind;
        this.selectedEntity = newEntity;
        this.selectedAsReadonly = false;
        this.selectedEntityIsNew = true;
    }
}

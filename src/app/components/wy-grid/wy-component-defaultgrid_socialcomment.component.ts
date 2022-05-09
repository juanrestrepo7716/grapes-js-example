import { Component, Inject, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { IEntityGridAction, ILeafClassDropDownButton, WyGridBaseComponent } from '../wy-grid/wy-grid-base.component';
import { PRIMARY_KEY_NULL_VALUE } from '../constants';
import { DynamicObjectExpressionApi } from '../types';
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'wy-component-defaultgrid_socialcomment',
    templateUrl: './wy-component-defaultgrid_socialcomment.component.html',
    styleUrls: [
        './wy-grid.component.scss'
    ]
})
export class WyGridComponent_DefaultGrid_SocialComment extends WyGridBaseComponent implements AfterViewInit, OnDestroy {
    public leafClassesDropDownButtons: ILeafClassDropDownButton[] = [
    ];
    public entityGridActionsDropDownButtons: IEntityGridAction[] = [
        {
            name: '$delete',
            disabled: !this.isFeatureEnabled('Delete_SocialComment')
        },
        {
            name: '$copy',
            disabled: !this.isFeatureEnabled('Copy_SocialComment')
        },
    ];
    public gcc: any = {
        '@odata.type': {
            visible: true,
        },
        'Id': {
            visible: false,
        },
        'SocialKey': {
            visible: true,
        },
        'UserName': {
            visible: true,
        },
        'Created': {
            visible: true,
        },
        'Text': {
            visible: true,
        },
    };
    public gcd: any = {
        '@odata.type': {
            minColWidth: '75',
        },
        'Id': {
            minColWidth: '50',
        },
        'SocialKey': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 0px)',
            field: 'SocialKey',
            format: '',
            filter: 'text',
        },
        'UserName': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 992px)',
            field: 'UserName',
            format: '',
            filter: 'text',
        },
        'Created': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 992px)',
            field: 'Created',
            format: '{0:g}',
            filter: 'date',
        },
        'Text': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 768px)',
            field: 'Text',
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
        return this.getClassNameByODataType(entity) || 'SocialComment';
    }
    protected getDataStoreName(): string {
        return 'default';
    }
    protected getReadDataSourceUri(): string {
        return '/SocialComments';
    }
    protected getWriteDataSourceUri(): string {
        return '/SocialComments';
    }
    protected getComponentIdentifier(): string {
        return 'wy-component-defaultgrid_socialcomment';
    }
    protected getExpandNavigationProperties(): string[] {
        const result: string[] = [];
        return result;
    }
    protected getQuickSearchFields(): string[] {
        const result: string[] = [];
        return result;
    }
    public addNewEntity(selectedEntityKind?: string) {
        let newEntity = null;
        const exp = new DynamicObjectExpressionApi(null, this.newEntityOwner, selectedEntityKind || 'SocialComment', this.newEntityOwnerClassName, this.usrSet); // TODO: support owner entity
        if (!newEntity) {
            newEntity = {
                Id: PRIMARY_KEY_NULL_VALUE,
                            Created: null,
            };
        }
        Object.assign(newEntity, this.newEntityDefaults);
        this.selectedEntityKind = selectedEntityKind;
        this.selectedEntity = newEntity;
        this.selectedAsReadonly = false;
        this.selectedEntityIsNew = true;
    }
}

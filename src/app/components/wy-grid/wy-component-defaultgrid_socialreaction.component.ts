import { Component, Inject, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { IEntityGridAction, ILeafClassDropDownButton, WyGridBaseComponent } from '../wy-grid/wy-grid-base.component';
import { PRIMARY_KEY_NULL_VALUE } from '../constants';
import { DynamicObjectExpressionApi } from '../types';
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'wy-component-defaultgrid_socialreaction',
    templateUrl: './wy-component-defaultgrid_socialreaction.component.html',
    styleUrls: [
        './wy-grid.component.scss'
    ]
})
export class WyGridComponent_DefaultGrid_SocialReaction extends WyGridBaseComponent implements AfterViewInit, OnDestroy {
    public leafClassesDropDownButtons: ILeafClassDropDownButton[] = [
    ];
    public entityGridActionsDropDownButtons: IEntityGridAction[] = [
        {
            name: '$delete',
            disabled: !this.isFeatureEnabled('Delete_SocialReaction')
        },
        {
            name: '$copy',
            disabled: !this.isFeatureEnabled('Copy_SocialReaction')
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
        'Reaction': {
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
        'Reaction': {
            minColWidth: '100',
            width: '',
            media: '(min-width: 992px)',
            field: 'Reaction',
            format: '{0:n0}',
            filter: 'numeric',
        },
    };
    // bindings for enum
    public properties: any = {
        'Reaction': {
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
        return this.getClassNameByODataType(entity) || 'SocialReaction';
    }
    protected getDataStoreName(): string {
        return 'default';
    }
    protected getReadDataSourceUri(): string {
        return '/SocialReactions';
    }
    protected getWriteDataSourceUri(): string {
        return '/SocialReactions';
    }
    protected getComponentIdentifier(): string {
        return 'wy-component-defaultgrid_socialreaction';
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
        const exp = new DynamicObjectExpressionApi(null, this.newEntityOwner, selectedEntityKind || 'SocialReaction', this.newEntityOwnerClassName, this.usrSet); // TODO: support owner entity
        if (!newEntity) {
            newEntity = {
                Id: PRIMARY_KEY_NULL_VALUE,
                            Reaction: 0,
            };
        }
        Object.assign(newEntity, this.newEntityDefaults);
        this.selectedEntityKind = selectedEntityKind;
        this.selectedEntity = newEntity;
        this.selectedAsReadonly = false;
        this.selectedEntityIsNew = true;
    }
}

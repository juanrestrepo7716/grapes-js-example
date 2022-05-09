import { Component, ViewEncapsulation, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicObjectExpressionApi } from '../types';
import { WyOneEntityBaseComponent } from './wy-one-entity-base.component';
@Component({
    selector: 'wy-component-defaultoneentity_todoitem',
    templateUrl: './wy-component-defaultoneentity_todoitem.component.html',
    styleUrls: ['./wy-one-entity.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WyOneEntityComponent_DefaultOneEntity_TodoItem extends WyOneEntityBaseComponent implements OnInit {
    public editForm: FormGroup;
    public exp: DynamicObjectExpressionApi;
    // bindings for lookup entity/entities, enum, compute, files and pictures
    public properties: any = {
            'Priority': {
                enum: [
                    {
                        value: +'0',
                        disabled: !this.isFeatureEnabled('Enum_Priority_High')
                    },
                    {
                        value: +'2',
                        disabled: !this.isFeatureEnabled('Enum_Priority_Low')
                    },
                    {
                        value: +'1',
                        disabled: !this.isFeatureEnabled('Enum_Priority_Medium')
                    },
                ],
            },
            'Owner': {
                lookupEntityData: [],
                validLookupEntityData: [],
                filteredLookupEntityData: [],
            },
            'Project': {
                lookupEntityData: [],
                validLookupEntityData: [],
                filteredLookupEntityData: [],
            },
    }
    public events: any = {
    }
    private _editFormSubscription: Subject<any>;
    constructor(
        cd: ChangeDetectorRef,
        @Inject('IAuthorizationService')
        azs: wy.IAuthorizationService,
        @Inject('IUserSettingsService')
        usrSet: wy.IUserSettingsService,
        @Inject('IDataService')
        ds: wy.IDataService,
        @Inject('IConstantService')
        cs: wy.IConstantService,
        @Inject('IUtilService')
        us: wy.IUtilService,
        @Inject('ILinkService')
        lns: wy.ILinkService,
        @Inject('IBlobService')
        bs: wy.IBlobService,
        @Inject('ILanguageService')
        ls: wy.ILanguageService,
        protected intl: IntlService,
        @Inject('IMessageService')
        ms: wy.IMessageService
    ) {
        super(cd, azs, usrSet, ds, cs, us, lns, bs, ls, intl, ms);
        this.createNewEditForm();
    }
    // create the form group with validation rules
    public createNewEditForm() {
        this.editForm = new FormGroup({
            '@odata.type': new FormControl(),
            'Id': new FormControl(),
                    'Name': new FormControl({value: '', disabled: JSON.parse('false')}
                    ,Validators.compose(
                        [
                                Validators.required,
                        ]
                    )
                    ),
                    'Priority': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
                    'Pictures': new FormControl(),
                    'Pictures_Count': new FormControl(),
                    'Created': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
                    'Notes': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
                    'Finished': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
                    'OwnerId': new FormControl(),
                        'Owner': new FormControl(),
                    'ProjectId': new FormControl(),
                        'Project': new FormControl(),
                    'Comments': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
        });
        if (this._editFormSubscription) {
            this._editFormSubscription.next();
            this._editFormSubscription.complete();
        }
        this._editFormSubscription = new Subject();
        // validate only properties that are visible
        this.editForm.valueChanges
            .pipe(takeUntil(this._editFormSubscription))
            .subscribe(() => {
            const noEmit = { emitEvent: false };
        });
        this.exp = new DynamicObjectExpressionApi(this.editForm, null, 'TodoItem', null, this.usrSet); // TODO: support owner entity
    }
    ngOnInit() {
            this.loadLookupEntityData('Owner', 'default', '/Users', '', '', '', '');
            this.loadLookupEntityData('Project', 'default', '/Projects', '', '', '', '');
        super.ngOnInit();
    }
    protected afterEntityLoaded(entity: wy.BaseEntity): void {
    }
    protected getDataStoreName(): string {
        return 'default';
    }
    protected getDataSourceUri(): string {
        return '/TodoItems';
    }
    protected prepareEntityForSave(entity: wy.BaseEntity): wy.BaseEntity {
        if (entity) {
            delete entity['@odata.type'];
            delete entity['Owner'];
            delete entity['Project'];
        }
        return entity;
    }
    protected getComponentIdentifier(): string {
        return 'wy-component-defaultoneentity_todoitem';
    }
    protected getExpandNavigationProperties(): string[] {
        const result: string[] = [];
        result.push('Owner');
        result.push('Project');
        return result;
    }
}

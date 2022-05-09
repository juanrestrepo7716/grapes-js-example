import { Component, ViewEncapsulation, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicObjectExpressionApi } from '../types';
import { WyOneEntityBaseComponent } from './wy-one-entity-base.component';
@Component({
    selector: 'wy-component-defaultoneentity_project',
    templateUrl: './wy-component-defaultoneentity_project.component.html',
    styleUrls: ['./wy-one-entity.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WyOneEntityComponent_DefaultOneEntity_Project extends WyOneEntityBaseComponent implements OnInit {
    public editForm: FormGroup;
    public exp: DynamicObjectExpressionApi;
    // bindings for lookup entity/entities, enum, compute, files and pictures
    public properties: any = {
            'Status': {
                enum: [
                    {
                        value: +'2',
                        disabled: !this.isFeatureEnabled('Enum_Status_Closed')
                    },
                    {
                        value: +'0',
                        disabled: !this.isFeatureEnabled('Enum_Status_New')
                    },
                    {
                        value: +'1',
                        disabled: !this.isFeatureEnabled('Enum_Status_Open')
                    },
                ],
            },
            'ProjectLocation': {
                enum: [
                    {
                        value: +'3',
                        disabled: !this.isFeatureEnabled('Enum_ProjectLocation_East')
                    },
                    {
                        value: +'2',
                        disabled: !this.isFeatureEnabled('Enum_ProjectLocation_North')
                    },
                    {
                        value: +'1',
                        disabled: !this.isFeatureEnabled('Enum_ProjectLocation_South')
                    },
                    {
                        value: +'0',
                        disabled: !this.isFeatureEnabled('Enum_ProjectLocation_West')
                    },
                ],
            },
            'TodoItems': {
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
                    'Status': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
                    'CreatedBy': new FormControl({value: '', disabled: JSON.parse('false')}
                    ,Validators.compose(
                        [
                                Validators.required,
                        ]
                    )
                    ),
                    'Picture': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
                    'ProjectLocation': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
                    'Comments': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
                    'Notes': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
                    'PdfDocument': new FormControl(),
                    'PdfDocument_Count': new FormControl(),
                    'ProjectFiles': new FormControl(),
                    'ProjectFiles_Count': new FormControl(),
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
        this.exp = new DynamicObjectExpressionApi(this.editForm, null, 'Project', null, this.usrSet); // TODO: support owner entity
    }
    ngOnInit() {
        super.ngOnInit();
    }
    protected afterEntityLoaded(entity: wy.BaseEntity): void {
    }
    protected getDataStoreName(): string {
        return 'default';
    }
    protected getDataSourceUri(): string {
        return '/Projects';
    }
    protected prepareEntityForSave(entity: wy.BaseEntity): wy.BaseEntity {
        if (entity) {
            delete entity['@odata.type'];
        }
        return entity;
    }
    protected getComponentIdentifier(): string {
        return 'wy-component-defaultoneentity_project';
    }
    protected getExpandNavigationProperties(): string[] {
        const result: string[] = [];
        return result;
    }
}

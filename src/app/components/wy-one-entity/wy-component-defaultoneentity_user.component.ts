import { Component, ViewEncapsulation, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicObjectExpressionApi } from '../types';
import { WyOneEntityBaseComponent } from './wy-one-entity-base.component';
@Component({
    selector: 'wy-component-defaultoneentity_user',
    templateUrl: './wy-component-defaultoneentity_user.component.html',
    styleUrls: ['./wy-one-entity.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WyOneEntityComponent_DefaultOneEntity_User extends WyOneEntityBaseComponent implements OnInit {
    public editForm: FormGroup;
    public exp: DynamicObjectExpressionApi;
    // bindings for lookup entity/entities, enum, compute, files and pictures
    public properties: any = {
            'Description': {
            computeExpression: () => "My name is:" + this.exp.currentEntity.getPropertyValue("Name"),
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
                    'EmailAddress': new FormControl({value: '', disabled: JSON.parse('false')}
                    ,Validators.compose(
                        [
                                Validators.pattern(`[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}`),
                        ]
                    )
                    ),
                    'Picture': new FormControl(),
                    'Picture_Size': new FormControl(),
                    'Picture_PosX': new FormControl(),
                    'Picture_PosY': new FormControl(),
                    'Color': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
                    'Description': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
                    'Enabled': new FormControl({value: '', disabled: JSON.parse('false')}
                    ),
                    'Attachment': new FormControl(),
                    'Attachment_Size': new FormControl(),
                    'Notes': new FormControl({value: '', disabled: JSON.parse('false')}
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
        this.exp = new DynamicObjectExpressionApi(this.editForm, null, 'User', null, this.usrSet); // TODO: support owner entity
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
        return '/Users';
    }
    protected prepareEntityForSave(entity: wy.BaseEntity): wy.BaseEntity {
        if (entity) {
            delete entity['@odata.type'];
        }
        return entity;
    }
    protected getComponentIdentifier(): string {
        return 'wy-component-defaultoneentity_user';
    }
    protected getExpandNavigationProperties(): string[] {
        const result: string[] = [];
        return result;
    }
}

//::Bag::Default
import { AfterViewInit, Input, OnInit, OnDestroy, OnChanges, ChangeDetectorRef, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IntlService } from '@progress/kendo-angular-intl';
import { WyBaseComponent } from '../wy-base.component';
import { FA_ICONS } from './../../icons';
@Directive()
export abstract class WyOneEntityBaseComponent extends WyBaseComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    public filteredIconList: string[] = [];
    protected latitudeRegex = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    protected longitudeRegex = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    public currencyFormatOptions: any = null;
    public hasEntity = false;
    public hideComplexComponents = true;
    public isFormValidationActive = false;
    private _isInitiated = false;
    @Input() public readonly = false;
    @Input() public isNew: boolean = false;
    @Input() public showPropertyNavigationTabs = true;
    @Input() public commentsActive: boolean = true;
    @Input() public reactionsActive: boolean = true;
    @Input() public tabPosition: 'top' | 'bottom' | 'left' | 'right';
    @Input() public secondaryTabPosition: 'top' | 'bottom' | 'left' | 'right';
    @Input() public set entity(entity: wy.BaseEntity) {
        if (entity != null) {
            this.createNewEditForm();
            this.editForm.reset(entity);
            this.afterEntityLoaded(entity);
            this.hasEntity = true;
        }
    }
    public get entity(): wy.BaseEntity {
        return this.editForm.getRawValue();
    }
    @Input() public set entityId(entityId: wy.PrimaryKey) {
        this.loadEntityById(entityId);
    }
    public abstract createNewEditForm(): void;
    public abstract editForm: FormGroup;
    public abstract properties: any;
    protected abstract afterEntityLoaded(entity: wy.BaseEntity): void;
    protected abstract getDataStoreName(): string;
    protected abstract getDataSourceUri(): string;
    protected abstract prepareEntityForSave(entity: wy.BaseEntity): wy.BaseEntity;
    protected abstract getExpandNavigationProperties(): string[];
    constructor(
        protected cd: ChangeDetectorRef,
        protected azs: wy.IAuthorizationService,
        protected usrSet: wy.IUserSettingsService,
        protected ds: wy.IDataService,
        protected cs: wy.IConstantService,
        protected us: wy.IUtilService,
        protected lns: wy.ILinkService,
        protected bs: wy.IBlobService,
        protected ls: wy.ILanguageService,
        protected intl: IntlService,
        protected ms: wy.IMessageService,
    ) {
        super();
        this.currencyFormatOptions = {
            style: 'currency',
            currency: usrSet.getCurrency(),
            currencyDisplay: 'name'
        };
        this.filteredIconList = FA_ICONS.slice();
        this.tabPosition = 'top';
        if (us.isSizeSmall()) {
            this.secondaryTabPosition = 'top';
        }
        else {
            this.secondaryTabPosition = 'left';
        }
    }
    ngOnInit() {
        this.hideComplexComponents = false;
        this._isInitiated = true;
    }
    ngAfterViewInit() {
    }
    ngOnChanges() {
        if (this._isInitiated) {
            this.hideComplexComponents = true;
            this.cd.detectChanges();
            this.hideComplexComponents = false;
        }
    }
    ngOnDestroy(): void {
    }
    public isFeatureEnabled(featureKey: string) {
        if (this.azs.isFeatureEnabled(featureKey)) {
            return this.usrSet.isFeatureEnabled(featureKey);
        }
        return false;
    }
    isValidEntityId() {
        const entityId = this.getEntityId();
        return this.us.isValidEntityId(entityId);
    }
    getEntityId(): wy.PrimaryKey {
        return this.editForm.get('Id').value;
    }
    public getCurrency() {
        return this.usrSet.getCurrency();
    }
    /**
     * Reload the entity from the datasource.
     */
    public reload() {
        if (this.editForm.value) {
            this.loadEntityById(this.editForm.value.Id);
        }
    }
    /**
     * Load the first entity from the datasource.
     */
    public async loadFirstEntity(): Promise<boolean> {
        const expandNavigationProperties = this.getExpandNavigationProperties();
        const expand = this.ds.getExpandExpression(expandNavigationProperties);
        const firstEntity = await this.ds.fetchFirst(this.getDataStoreName(), this.getDataSourceUri(), null, expand).toPromise();
        this.entity = firstEntity;
        return (firstEntity != null);
    }
    /**
     * Load an entity by id.
     * @param entityId Id of the entity.
     */
    public async loadEntityById(entityId: wy.PrimaryKey): Promise<boolean> {
        if (this.us.isValidEntityId(entityId)) {
            const expandNavigationProperties = this.getExpandNavigationProperties();
            const expand = this.ds.getExpandExpression(expandNavigationProperties);
            const entity = await this.ds.fetchOne(this.getDataStoreName(), this.getDataSourceUri(), entityId, null, expand).toPromise();
            this.entity = entity;
            return (entity != null);
        }
        return false;
    }
    // icon list
    handleIconFilterChange(value) {
        this.filteredIconList = FA_ICONS.filter((s) => s && s.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
    public getBlobUri(blobName: string) {
        return this.bs.getBlobUriByName(blobName);
    }
    public getLookupName(relatedEntity: any) {
        if (relatedEntity) {
            return relatedEntity.Name;
        }
        else {
            return '';
        }
    }
    public getBooleanDisplay(value: boolean) {
        if (value) {
            return `<input type="checkbox" disabled checked /><br />`;
        }
        else {
            return `<input type="checkbox" disabled /><br />`;
        }
    }
    public dropDownItemDisabled(itemArgs: { dataItem: any, index: number }) {
        return itemArgs?.dataItem?.disabled;
    }
    public saveEntity(handler: (success: boolean, entity: wy.BaseEntity) => any) {
        if (!this.editForm.valid) {
            this.isFormValidationActive = true;
            alert(this.ls.translate('InvalidDataPleaseCorrect'));
            handler(false, null);
            return;
        }
        const completeEntity: wy.BaseEntity = this.editForm.getRawValue();
        let partialEntity: wy.BaseEntity;
        if (this.isNew) {
            // new: send all values
            partialEntity = completeEntity;
        }
        else {
            // update: only changed/dirty values
            partialEntity = { Id: this.getEntityId() };
            Object.keys(this.editForm.controls).forEach(key => {
                const control = this.editForm.get(key);
                if (control && control.dirty) {
                    partialEntity[key] = control.value;
                }
            });
        }
        partialEntity = this.prepareEntityForSave(partialEntity);
        this.ds.save(this.getDataStoreName(), this.getDataSourceUri(), partialEntity, this.isNew)
            .subscribe(
                () => {
                    handler(true, completeEntity);
                },
                () => {
                    handler(false, null);
                }
            );
    }
    // show only valid lookup items matching the cascade
    protected validateLookupCascade(lookupCascadeToPropertyName: string, lookupCascadeFromPropertyName: string, lookupCascadeFromClassName: string) {
        const prop = this.properties[lookupCascadeToPropertyName];
        const entities = prop.lookupEntityData;
        const toControl = this.editForm.get(lookupCascadeToPropertyName + 'Id');
        const fromControl = this.editForm.get(lookupCascadeFromPropertyName + 'Id');
        const value = fromControl.value;
        if (this.us.isValidEntityId(value)) {
            prop.validLookupEntityData = entities.filter((x) => x[lookupCascadeFromClassName + 'Id'] == value);
            prop.filteredLookupEntityData = prop.validLookupEntityData;
            toControl.enable();
        }
        else {
            toControl.disable();
        }
    }
    protected clearLookupCascade(lookupCascadeToPropertyName: string) {
        const toControl = this.editForm.get(lookupCascadeToPropertyName + 'Id');
        toControl.setValue(null);
    }
    // lookup entity filter when typing
    public handleLookupEntityFilterChange(value, lookupPropertyName: string) {
        const prop = this.properties[lookupPropertyName];
        prop.filteredLookupEntityData = prop.validLookupEntityData.filter((s) => s['Name'].toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
    protected async loadLookupEntitiesData(propertyName: string, dataStoreName: string, dataSourceUri: string, lookupEntityFilter: string) {
        const baseFilter = this.ds.getNotInRecycleBinFilter();
        const data = await this.ds.fetch(dataStoreName, dataSourceUri, this.ds.mergeFilters(baseFilter, lookupEntityFilter)).toPromise();
        const prop = this.properties[propertyName];
        prop.lookupEntitiesData = data;
    }
    protected async loadLookupEntityData(propertyName: string, dataStoreName: string, dataSourceUri: string, lookupGroupByPropertyName: string, lookupCascadeFromPropertyName: string, lookupCascadeFromClassName: string, lookupEntityFilter: string) {
        const baseFilter = this.ds.getNotInRecycleBinFilter();
        const expandNavigationProperties = [];
        if (lookupGroupByPropertyName) {
            expandNavigationProperties.push(lookupGroupByPropertyName);
        }
        const expand = this.ds.getExpandExpression(expandNavigationProperties);
        const data = await this.ds.fetch(dataStoreName, dataSourceUri, this.ds.mergeFilters(baseFilter, lookupEntityFilter), expand).toPromise();
        const prop = this.properties[propertyName];
        prop.lookupEntityData = data; // all entities
        prop.validLookupEntityData = data; // entities valid in the cascade
        prop.filteredLookupEntityData = data; // entities filtered by user
        if (lookupCascadeFromPropertyName) {
            this.validateLookupCascade(propertyName, lookupCascadeFromPropertyName, lookupCascadeFromClassName);
        }
    }
    protected async loadTypings(propertyName: string, dataStoreName: string) {
        const typings = await this.ds.fetchValue(dataStoreName, '/GetTypings').toPromise();
        this.properties[propertyName].libraries.push({
            Name: 'typings',
            Source: typings,
        });
    }
    /**
     * Sets relationships using ...Ids property, primary key array.
     * @param propertyName 
     * @param entity 
     */
    protected setLookupEntitiesIds(propertyName: string, entity: wy.BaseEntity) {
        const prop = entity[propertyName];
        if (prop && Array.isArray(prop)) {
            const newProp = [];
            for (let lookupEntity of prop) {
                const id = lookupEntity.Id;
                newProp.push(id);
            }
            entity[propertyName + 'Ids'] = newProp;
            delete entity[propertyName];
        }
    }
    public setCurrentLocation(propertyName: string) {
        navigator.geolocation.getCurrentPosition((position: Position) => {
            const latControl = this.editForm.get(propertyName + '_Latitude');
            const lngControl = this.editForm.get(propertyName + '_Longitude');
            latControl.setValue(position.coords.latitude.toString());
            latControl.markAsDirty();
            lngControl.setValue(position.coords.longitude.toString());
            lngControl.markAsDirty();
        }, (err) => {
            this.ms.notify(err?.message, 'error');
        });
    }
    /**
     * Sets relationships using object property, cleans other properties.
     * @param propertyName 
     * @param entity 
     */
    protected clearLookupEntities(propertyName: string, entity: wy.BaseEntity) {
        const prop = entity[propertyName];
        if (prop && Array.isArray(prop)) {
            const newProp = [];
            for (let lookupEntity of prop) {
                const id = lookupEntity.Id;
                newProp.push({ Id: id });
            }
            entity[propertyName] = newProp;
        }
    }
}

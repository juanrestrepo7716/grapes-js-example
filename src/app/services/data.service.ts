//::Bag::Default
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toODataString } from '@progress/kendo-data-query';
import { BaseHttpService } from './base-http.service';
import { share, map } from "rxjs/operators";
import { Observable, EMPTY } from 'rxjs';
@Injectable()
export class DataService extends BaseHttpService implements wy.IDataService {
    private _defaultExpandFields = 'Id,Name';
    constructor(
        @Inject('IUtilService')
        private _us: wy.IUtilService,
        @Inject('IConstantService')
        private _cs: wy.IConstantService,
        @Inject('IMessageService')
        private _ms: wy.IMessageService,
        @Inject('ILanguageService')
        private _ls: wy.ILanguageService,
        @Inject('IBlobService')
        private _bs: wy.IBlobService,
        private http: HttpClient) {
        super();
    }
    public getExpandExpression(
        expandNavigationProperties: string[]): string {
        if (expandNavigationProperties.length > 0) {
            let expandQuery = '';
            for (const navProp of expandNavigationProperties) {
                if (expandQuery.length > 0) {
                    expandQuery += ',';
                }
                expandQuery += `${navProp}($select=${this._defaultExpandFields})`; // TODO: configurable which fields?
            }
            return expandQuery;
        }
        return null;
    }
    public save(
        dataStoreName: string,
        dataSourceUri: string,
        entity: wy.BaseEntity,
        isNew: boolean = false,
        silent: boolean = false): Observable<wy.IODataResponse> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };
        if (!silent) {
            this._ms.showProgress(this._ls.translate('PleaseWait'), this._ls.translate('YourRequestIsBeingProcessed'));
        }
        if (isNew) {
            const uri = `${this._cs.getServiceLayerODataUri(dataStoreName, dataSourceUri)}`;
            const observable = this.http.post<wy.IODataResponse>(uri, entity, BaseHttpService.AsHttpJson())            
                .pipe(share());
            if (!silent) {
                this.trackDataSubmissionResult(observable);
            }
            return observable;
        }
        else {
            const uri = `${this._cs.getServiceLayerODataUri(dataStoreName, dataSourceUri)}(${entity.Id})`;
            const observable = this.http.patch<wy.IODataResponse>(uri, entity, BaseHttpService.AsHttpJson())
                .pipe(share());
            if (!silent) {
                this.trackDataSubmissionResult(observable);
            }
            return observable;
        }
    }
    public remove(
        dataStoreName: string,
        dataSourceUri: string,
        entity: wy.BaseEntity,
        silent: boolean = false): Observable<wy.IODataResponse> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };
        if (!silent) {
            this._ms.showProgress(this._ls.translate('PleaseWait'), this._ls.translate('YourRequestIsBeingProcessed'));
        }
        const uri = `${this._cs.getServiceLayerODataUri(dataStoreName, dataSourceUri)}(${entity.Id})`;
        const observable = this.http.delete<wy.IODataResponse>(uri, BaseHttpService.AsHttpJson())
            .pipe(share());
        if (!silent) {
            this.trackDataSubmissionResult(observable);
        }
        return observable;
    }
    public restore(
        dataStoreName: string,
        dataSourceUri: string,
        entity: wy.BaseEntity,
        silent: boolean = false): Observable<wy.IODataResponse> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };
        if (!silent) {
            this._ms.showProgress(this._ls.translate('PleaseWait'), this._ls.translate('YourRequestIsBeingProcessed'));
        }
        const uri = `${this._cs.getServiceLayerODataUri(dataStoreName, dataSourceUri)}(${entity.Id})`;
        // TODO: explicit delete/restore?
        const observable = this.http.delete<wy.IODataResponse>(uri, BaseHttpService.AsHttpJson())
            .pipe(share());
        if (!silent) {
            this.trackDataSubmissionResult(observable);
        }
        return observable;
    }
    public triggerOperation(
        dataStoreName: string,
        dataSourceUri: string,
        operationName: string,
        entityId: wy.PrimaryKey = null,
        data: any = null,
        pictureUrl: string = null,
        silent: boolean = false): Observable<any> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };
        const baseUri = this._cs.getServiceLayerODataUri(dataStoreName, dataSourceUri);
        let uri = '';
        if (entityId) {
            uri = `${baseUri}(${entityId})/${operationName}`;
        }
        else {
            uri = `${baseUri}/${operationName}`;
        }
        if (!silent) {
            this._ms.showProgress(this._ls.translate('PleaseWait'), this._ls.translate('YourRequestIsBeingProcessed'), pictureUrl);
        }
        const observable = this.http.post<wy.IODataResponse>(uri, data, BaseHttpService.AsHttpJson())
            .pipe(map(response => {
                if (response && response.value instanceof Array) {
                    return response.value;
                }
                else {
                    return response;
                }
            }))
            .pipe(share());
        if (!silent) {
            observable.subscribe(
                response => {
                    this._ms.hideProgress();
                    if (Array.isArray(response) && response.length > 0) {
                        // TODO: find another way to detect operation result types.
                        if (response[0].Message && response[0].MessageType) {
                            // show notification
                            if (response[0].MessageType == 'ErrorNotification') {
                                this.showCustomNotification(response[0].Message, 'error');
                            }
                            else if (response[0].MessageType == 'WarningNotification') {
                                this.showCustomNotification(response[0].Message, 'warning');
                            }
                            else if (response[0].MessageType == 'SuccessNotification') {
                                this.showCustomNotification(response[0].Message, 'success');
                            }
                        } else if (response[0].Message) {
                            // show message
                            this.showCustomSuccessMessage(response[0].Message);
                        } else if (response[0].Name) {
                            // download blob
                            window.location.href = this._bs.getBlobUriByName(response[0].Name, response[0].BoxId);
                        } else {
                            this.showOperationSuccessMessage();
                        }
                    } else {
                        this.showOperationSuccessMessage();
                    }
                },
                () => {
                    this._ms.hideProgress();
                    this.showOperationFailMessage();
                }
            );
        }
        return observable;
    }
    public fetchCount(
        dataStoreName: string,
        dataSourceUri: string,
        filter: string = null,
    ): Observable<number> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };
        let uri = this._cs.getServiceLayerODataUri(dataStoreName, dataSourceUri);
        uri = this.mergeQueryString(uri, '$top=0');
        uri = this.enableCount(uri);
        uri = this.mergeFilter(uri, filter);
        return this.http
            .get<wy.IODataResponse>(uri, BaseHttpService.AsHttpJson())
            .pipe(map(response => {
                return response['@odata.count'];
            }));
    }
    public fetchValue(
        dataStoreName: string,
        dataSourceUri: string,
        filter: string = null,
    ): Observable<any> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };
        let uri = this._cs.getServiceLayerODataUri(dataStoreName, dataSourceUri);
        uri = this.mergeFilter(uri, filter);
        return this.http
            .get<wy.IODataResponse>(uri, BaseHttpService.AsHttpJson())
            .pipe(map(response => {
                return response.value;
            }));
    }
    public fetchRaw(
        dataStoreName: string,
        dataSourceUri: string,
        filter: string = null,
        expand: string = null,
        top: number = null,
        select: string = null,
        orderby: string = null,
    ): Observable<any> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };
        let uri = this._cs.getServiceLayerODataUri(dataStoreName, dataSourceUri);
        uri = this.appendTop(uri, top);
        uri = this.mergeFilter(uri, filter);
        uri = this.mergeExpand(uri, expand);
        uri = this.appendSelect(uri, select);
        uri = this.mergeOrderBy(uri, orderby);
        return this.http
            .get<any>(uri, BaseHttpService.AsHttpJson());
    }
    public fetch(
        dataStoreName: string,
        dataSourceUri: string,
        filter: string = null,
        expand: string = null,
        top: number = null,
        select: string = null,
        orderby: string = null,
    ): Observable<wy.BaseEntity[]> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };
        let uri = this._cs.getServiceLayerODataUri(dataStoreName, dataSourceUri);
        uri = this.appendTop(uri, top);
        uri = this.mergeFilter(uri, filter);
        uri = this.mergeExpand(uri, expand);
        uri = this.appendSelect(uri, select);
        uri = this.mergeOrderBy(uri, orderby);
        return this.http
            .get(uri, BaseHttpService.AsHttpText())
            .pipe(map(response => JSON.parse(response, this.jsonDateParser)))
            .pipe(map(response => {
                if (response && response.value instanceof Array) {
                    return response.value;
                }
                else {
                    return response;
                }
            }));
    }
    public fetchData(
        dataStoreName: string,
        dataSourceUri: string,
        filter: string,
        expand: string,
        state: wy.IDataState,
    ): Observable<wy.IDataResult> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };
        let uri = this._cs.getServiceLayerODataUri(dataStoreName, dataSourceUri);
        uri = this.mergeQueryString(uri, toODataString(state));
        uri = this.enableCount(uri);
        uri = this.mergeFilter(uri, filter);
        uri = this.mergeExpand(uri, expand);
        return this.http
            .get(uri, BaseHttpService.AsHttpText())
            .pipe(share())
            .pipe(map(response => JSON.parse(response, this.jsonDateParser)))
            .pipe(map(response => {
                return {
                    data: response.value,
                    total: parseInt(response['@odata.count'], 10)
                };
            }));
    }
    public fetchOne(
        dataStoreName: string,
        dataSourceUri: string,
        entityId: wy.PrimaryKey,
        filter: string = null,
        expand: string = null,
    ): Observable<wy.BaseEntity> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };
        let uri = this._cs.getServiceLayerODataUri(dataStoreName, dataSourceUri) + `(${entityId})`;
        uri = this.mergeFilter(uri, filter);
        uri = this.mergeExpand(uri, expand);
        return this.http
            .get(uri, BaseHttpService.AsHttpText())
            .pipe(map(response => JSON.parse(response, this.jsonDateParser)))
            .pipe(map(response => {
                return response;
            }));
    }
    public fetchFirst(
        dataStoreName: string,
        dataSourceUri: string,
        filter: string = null,
        expand: string = null,
    ): Observable<wy.BaseEntity> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };
        let uri = this._cs.getServiceLayerODataUri(dataStoreName, dataSourceUri);
        uri = this.appendTop(uri, 1);
        uri = this.mergeFilter(uri, filter);
        uri = this.mergeExpand(uri, expand);
        return this.http
            .get(uri, BaseHttpService.AsHttpText())
            .pipe(map(response => JSON.parse(response, this.jsonDateParser)))
            .pipe(map(response => {
                if (response && response.value && response.value.length > 0) {
                    const first = response.value[0];
                    return first;
                }
                return null;
            }));
    }
    public getInRecycleBinFilter(): string {
        return null;
    }
    public getNotInRecycleBinFilter(): string {
        return null;
    }
    /**
     * Merge 2 OData filters.
     * @param filter1 Filter expression 1.
     * @param filter2 Filter expression 2.
     */
    public mergeFilters(filter1: string, filter2: string): string {
        let mergedFilter = filter1;
        if (filter2) {
            if (mergedFilter) {
                mergedFilter = mergedFilter + ' and ' + filter2;
            }
            else {
                mergedFilter = filter2;
            }
        }
        return mergedFilter;
    }
    private mergeFilter(uri: string, filter: string): string {
        if (filter != null && filter !== '') {
            if (uri.indexOf('$filter=') != -1) {
                // merge
                return uri.replace('$filter=', `$filter=${filter} and `);
            }
            else {
                // append
                return this.mergeQueryString(uri, `$filter=${filter}`);
            }
        }
        return uri;
    }
    private mergeExpand(uri: string, expand: string): string {
        if (expand != null && expand !== '') {
            if (uri.indexOf('$expand=') != -1) {
                // merge
                return uri.replace('$expand=', `$expand=${expand},`);
            }
            else {
                // append
                return this.mergeQueryString(uri, `$expand=${expand}`);
            }
        }
        return uri;
    }
    private appendTop(uri: string, top: number): string {
        if (top > 0) {
            return this.mergeQueryString(uri, `$top=${top}`);
        }
        return uri;
    }
    private enableCount(uri: string): string {
        if (uri.indexOf('$count=') != -1) {
            // already set
            return uri;
        }
        else {
            // append
            return this.mergeQueryString(uri, `$count=true`);
        }
    }
    private appendSelect(uri: string, select: string): string {
        // TODO: merge select
        if (select != null && select !== '') {
            return this.mergeQueryString(uri, `$select=${select}`);
        }
        return uri;
    }
    private mergeOrderBy(uri: string, orderby: string): string {
        if (orderby != null && orderby !== '') {
            if (uri.indexOf('$orderby=') != -1) {
                // merge
                return uri.replace('$orderby=', `$orderby=${orderby},`);
            }
            else {
                // append
                return this.mergeQueryString(uri, `$orderby=${orderby}`);
            }
        }
        return uri;
    }
    private mergeQueryString(uri: string, queryString: string) {
        if (uri.indexOf('?') > -1) {
            return uri + '&' + queryString;
        }
        return uri + '?' + queryString;
    }
    private showOperationSuccessMessage() {
        this._ms.modalMessage(this._ls.translate('Succeeded'),
            this._ls.translate('YourRequestCompletedSuccessfully'));
    }
    private showOperationFailMessage() {
        this._ms.modalMessage(this._ls.translate('Failed'),
            this._ls.translate('YourRequestFailed'));
    }
    private showCustomSuccessMessage(message: string) {
        this._ms.modalMessage(this._ls.translate('Succeeded'), message);
    }
    private showCustomNotification(notification: string, style: 'none' | 'success' | 'warning' | 'error' | 'info') {
        this._ms.notify(notification, style);
    }
    private showDataSuccessNotification() {
        this._ms.notify(this._ls.translate('DataSaved'), 'success');
    }
    private showDataFailedNotification() {
        this._ms.notify(this._ls.translate('DataNotSaved'), 'error');
    }
    private trackDataSubmissionResult(observable: Observable<any>) {
        observable.subscribe(
            () => {
                this.showDataSuccessNotification();
                this._ms.hideProgress();
            },
            () => {
                this.showDataFailedNotification();
                this._ms.hideProgress();
            }
        );
    }
}

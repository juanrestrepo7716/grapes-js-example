//::Bag::Default
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IntlService } from '@progress/kendo-angular-intl';
import * as jwt_decode from 'jwt-decode';
import { BaseHttpService } from './base-http.service';
import { Title } from '@angular/platform-browser';
@Injectable()
export class UtilService implements wy.IUtilService {
    private _lastUid: string;
    constructor(
        private _intl: IntlService,
        @Inject('IConstantService')
        private _cs: wy.IConstantService,
        private http: HttpClient,
        private titleService: Title,
        private _router: Router
    ) {
        this._lastUid = null;
    }
    public getFileExtension(fileName: string): string {
        const re = /(?:\.([^.]+))?$/;
        const parts = re.exec(fileName);
        if (parts.length > 1 && parts[1]) {
            return parts[1];
        }
        else {
            return '';
        }
    }
    public setDocumentTitle(title: string): void {
        if (title) {
            this.titleService.setTitle(`${title} - Todo App 2.32`);
        }
        else {
            this.titleService.setTitle(`Todo App 2.32`);
        }
    }
    public logoutIfInvalidJwt(): boolean {
        if (!this.hasValidJwt()) {
            this.logout();
            return true;
        }
        return false;
    }
    public async logout() {
        const jwt = this.getValidatedJwt();
        if (jwt) {
            const clearTokenUri = this._cs.getServiceLayerClearTokenUri();
            await this.http.post(clearTokenUri, null, BaseHttpService.AsHttpJson()).toPromise();
        }
        this._router.navigate([this._cs.getLoginPageUrl()]);
    }
    public getValidatedJwt(): wy.Jwt {
        const jwt = this.getJwt();
        const config = this._cs.getConfig();
        // check if we have a token
        if (!jwt) {
            console.info('Missing token.');
            return null;
        }
        // check if we have a tenant
        if (!jwt.tenant) {
            console.info('Missing tenant.', jwt);
            return null;
        }
        // check if we have a username
        if (!jwt.username) {
            console.info('Missing username.', jwt);
            return null;
        }
        // check issuer
        if (jwt.iss != config.jwtIssuer) {
            console.info('Invalid issuer.', jwt);
            return null;
        }
        // check if expired
        const now = (new Date()).getTime();
        if (jwt.exp < (now / 1000)) {
            console.info('Token expired.', jwt);
            return null;
        }
        else {
            this.triggerUidEvent(jwt.username); // for tracking purposes
            return jwt;
        }
    }
    private triggerUidEvent(uid: string) {
        if (this._lastUid != uid) {
            this._lastUid = uid;
            const event = new CustomEvent('wy_uid_changed', {
                detail: {
                    uid: uid
                }
            });
            window.dispatchEvent(event);
        }
    }
    public hasValidJwt(): boolean {
        return this.getValidatedJwt() != null;
    }
    public canRefreshJwt(): boolean {
        const jwt = this.getValidatedJwt();
        return (jwt && jwt.rft != '' && jwt.rft != null);
    }
    public formatBytes(bytes: number, decimals: number): string {
        if (bytes == 0) {
            return '0 Byte';
        }
        const k = 1024;
        const dm = decimals + 1 || 3;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    public formatLookupEntities(data: any[]): string {
        let result = '';
        if (data) {
            for (let i = 0; i < data.length; i++) {
                result += data[i].Name + '; ';
            }
        }
        return result;
    }
    public formatJsonProperties(data: string, lineBreaks: boolean): string {
        let result = '';
        if (data) {
            const object = JSON.parse(data);
            for (const property in object) {
                if (object.hasOwnProperty(property)) {
                    result += '<strong>' + property.toUpperCase() + '</strong>: ' + object[property] + ' ';
                    if (lineBreaks) {
                        result += '<br>';
                    }
                }
            }
        }
        return result;
    }
    public formatDateTime(data: any): string {
        if (data) {
            return this._intl.format('{0:dd-MM-yyyy HH:mm:ss}', new Date(data));
        }
        else {
            return '';
        }
    }
    public formatDate(data: any): string {
        if (data) {
            return this._intl.format('{0:dd-MM-yyyy}', new Date(data));
        }
        else {
            return '';
        }
    }
    public formatTime(data: any): string {
        if (data) {
            return this._intl.format('{0:HH:mm:ss}', new Date(data));
        }
        else {
            return '';
        }
    }
    public formatMultilineText(data: string): string {
        if (data) {
            const rg = new RegExp('\n', 'g');
            return data.replace(rg, '<br>');
        }
        else {
            return '';
        }
    }
    public formatUrl(data: string): string {
        if (data) {
            return this._intl.format('<a href="{0}" target="_blank">{0}</a>', data);
        }
        else {
            return '';
        }
    }
    public isValidEntityId(value: wy.PrimaryKey): boolean {
        if (value > 0) {
            return true;
        }
        return this.isGuid(value as string);
    }
    public isValidCoords(lat: number, lng: number): boolean {
        if (lat == null || lat == undefined) {
            return false;
        }
        if (lng == null || lng == undefined) {
            return false;
        }
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            return true;
        }
        return false;
    }
    public isSizeSmall(): boolean {
        if (window.matchMedia('(max-width: 600px)').matches) {
            return true;
        }
        return false;
    }
    public isSizeMedium(): boolean {
        if (window.matchMedia('(max-width: 768px)').matches) {
            return true;
        }
        return false;
    }
    private isGuid(value: string) {
        var regex = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;
        var match = regex.exec(value);
        return match != null;
    }
    private getCookie(cookieName: string) {
        var name = cookieName + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    private getJwt(): wy.Jwt {
        const config = this._cs.getConfig();
        const token = this.getCookie(config.jwtCookieName);
        // check if token exists
        if (!token) {
            console.info('No token.');
            return null;
        }
        // parse token
        try {
            return jwt_decode(token);
        }
        catch (ex) {
            console.info('Could not parse token.');
            return null;
        }
    }
}

//::Bag::Default
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from "@angular/core";
import { AuthorizationMapStorageKey } from '../components/constants';
import { BaseHttpService } from './base-http.service';
@Injectable()
export class AuthorizationService implements wy.IAuthorizationService {
    private _cachedAuthMap: wy.AuthorizationMap = null;
    constructor(
        @Inject('IConstantService')
        private _cs: wy.IConstantService,
        @Inject('IStorageService')
        private _st: wy.IStorageService,
        private http: HttpClient) {
    }
    isAuthorizationMapsEnabled(): boolean {
        const reqAuthMapsUri = this._cs.getServiceLayerRequestAuthorizationMapsUri();
        if (reqAuthMapsUri) {
            return true;
        }
        return false;
    }
    async refreshAuthorizationMaps(): Promise<void> {
        const reqAuthMapsUri = this._cs.getServiceLayerRequestAuthorizationMapsUri();
        if (reqAuthMapsUri) {
            try {
                const response = await this.http.get<wy.IODataResponse>(reqAuthMapsUri, BaseHttpService.AsHttpJson()).toPromise();
                if (response != null && response.value != null && response.value.length > 0) {
                    const maps = response.value as wy.AuthorizationMap[];
                    for (let map of maps) {
                        if (map.AppName && map.AppName.toLowerCase() == 'todo') {
                            this.storeAuthorizationMap(map);
                            return;
                        }
                    }
                }
            }
            catch (ex) {
                console.warn('⚠️ Could not refresh authorization maps.', ex);
            }
        }
        this.storeAuthorizationMap(null);
    }
    private storeAuthorizationMap(authMap: wy.AuthorizationMap) {
        console.log('Storing authorization map.', authMap);
        this._st.setValue(AuthorizationMapStorageKey, authMap);
        this._cachedAuthMap = authMap;
    }
    getAuthorizationMap(): wy.AuthorizationMap {
        if (this._cachedAuthMap) {
            return this._cachedAuthMap;
        }
        return this._st.getValue(AuthorizationMapStorageKey);
    }
    isFeatureEnabled(featureKey: string): boolean {
        return true;
    }
    private isMatch(requestedPermissionKey: string, authMapEntry: string): boolean {
        if (authMapEntry == '*') {
            return true;
        }
        // TODO: make simple wildcard search more advanced
        if (authMapEntry.indexOf('*') > -1) {
            if (authMapEntry.startsWith('*')) {
                return requestedPermissionKey.endsWith(authMapEntry.replace('*', ''));
            }
            if (authMapEntry.endsWith('*')) {
                return requestedPermissionKey.startsWith(authMapEntry.replace('*', ''));
            }
        }
        return requestedPermissionKey == authMapEntry;
    }
}

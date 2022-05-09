//::Bag::Default
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from "@angular/core";
import { UserSettingsStorageKey } from '../components/constants';
import { BaseHttpService } from './base-http.service';
@Injectable()
export class UserSettingsService implements wy.IUserSettingsService {
    private _cachedUserSettings: wy.UserSetting[] = null;
    constructor(
        @Inject('IConstantService')
        private _cs: wy.IConstantService,
        @Inject('IStorageService')
        private _st: wy.IStorageService,
        private http: HttpClient) {
    }
    async refreshUserSettings(): Promise<void> {
        const reqUserSettingssUri = this._cs.getServiceLayerRequestUserSettingsUri();
        if (reqUserSettingssUri) {
            try {
                const response = await this.http.get<wy.IODataResponse>(reqUserSettingssUri, BaseHttpService.AsHttpJson()).toPromise();
                if (response != null && response.value != null && response.value.length > 0) {
                    const userSettings = response.value as wy.UserSetting[];
                    this.storeUserSettings(userSettings);
                    return;
                }
            }
            catch (ex) {
                console.warn('⚠️ Could not refresh user settings.', ex);
            }
        }
        this.storeUserSettings(null);
    }
    private storeUserSettings(userSettings: wy.UserSetting[]) {
        console.log('Storing user settings.', userSettings);
        this._st.setValue(UserSettingsStorageKey, userSettings);
        this._cachedUserSettings = userSettings;
    }
    getUserSettings(): wy.UserSetting[] {
        if (this._cachedUserSettings) {
            return this._cachedUserSettings;
        }
        return this._st.getValue(UserSettingsStorageKey);
    }
    isFeatureEnabled(featureKey: string): boolean {
        const isFeatureEnabled = this.getUserSetting('FeatureToggle_' + featureKey);
        if (isFeatureEnabled == "false") {
            return false;
        }
        return true; // features are enabled by default
    }
    public getUserSetting(key: string): string {
        const userSettings = this.getUserSettings();
        if (userSettings) {
            for (let entry of userSettings) {
                if (entry.Key == key) {
                    return entry.Value;
                }
            }
        }
        return null;
    }
    public getCurrency(): string {
        return this.getUserSetting('Currency') || 'EUR';
    }
}

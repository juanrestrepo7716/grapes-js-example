//::Bag::Default
export class ConstantService implements wy.IConstantService {
    private _config: wy.IConfig;
    private _namespace: string;
    private _defaultDataStoreName: string;
    constructor(config: wy.IConfig,
        namespace: string,
        defaultDataStoreName: string) {
        this._config = config;
        this._namespace = namespace;
        this._defaultDataStoreName = defaultDataStoreName;
    }
    public getLoginPageUrl(): string {
        return '/pages/login';
    }
    public getConfig(): wy.IConfig {
        return this._config;
    }
    public getServiceLayerODataUri(dataStoreName: string = null, dataSourceUri: string = null) {
        if (dataStoreName == null) {
            dataStoreName = this._defaultDataStoreName;
        }
        if (dataSourceUri == null) {
            return this._config.deploymentUri + '/' + dataStoreName;
        }
        else {
            return this._config.deploymentUri + '/' + dataStoreName + dataSourceUri;
        }
    }
    public getServiceLayerBlobUri() {
        return this._config.deploymentUri + '/blob';
    }
    private getAuthenticationBaseUri() {
        if (this._config.authenticatorUri) {
            return this._config.authenticatorUri;
        }
        return this._config.deploymentUri + '/' + this._defaultDataStoreName;
    }
    public getServiceLayerPreAuthenticateUri() {
        return this.getAuthenticationBaseUri() + '/PreAuthenticate';
    }
    public getServiceLayerAuthenticateUri() {
        return this.getAuthenticationBaseUri() + '/Authenticate';
    }
    public getServiceLayerClearTokenUri() {
        return this.getAuthenticationBaseUri() + '/ClearToken';
    }
    public getServiceLayerRefreshTokenUri() {
        return this.getAuthenticationBaseUri() + '/RefreshToken';
    }
    public getServiceLayerRequestAuthorizationMapsUri() {
        return null; // not supported
    }
    public getServiceLayerRequestUserSettingsUri() {
        return this.getServiceLayerRootUri() + '/' + this._defaultDataStoreName + '/RequestUserSettings';
    }
    public getServiceLayerRootUri() {
        return this._config.deploymentUri;
    }
    public getHangfireDashboardUri() {
        return this._config.deploymentUri + '/../jobs';
    }
    public getSwaggerUri() {
        return this._config.deploymentUri + '/../swagger';
        return null; // not supported
    }
    public getReportServerUri() {
        return this._config.reportServerUri;
    }
    public getNamespace() {
        return this._namespace;
    }
}

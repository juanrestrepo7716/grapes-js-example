declare namespace wy {
    interface IODataResponse {
        value: any | any[];
    }

    interface IConfig {
        deploymentUri: string;
        defaultCultureTwoLetterISOLanguageName: string;
        accessTokenTimeoutInSeconds: string;
        reportServerUri: string;
        jwtIssuer: string;
        jwtCookieName: string;
        authenticatorUri: string;
        appLauncherConfigUri: string;
    }

    interface ITenantDetails {
        TenantName: string;
        TenantImage: string;
    }

    interface IAvailableTenant extends ITenantDetails {
        RequireTwoFactorAuthentication: boolean;
    }

    interface IComment {
        Text: string;
        UserName?: string;
        UserAvatar?: string;
        Created?: Date;
    }

    interface IReaction {
        ReactionType: number;
        Motivation?: string;
    }

    interface IDataState {
        sort?: any[];
        skip: number;
        take: number;
        filter?: any;
    }

    interface IDataResult {
        data: any[];
        total: number;
    }

    interface ISaveEvent {
        close: boolean;
    }

    interface IObservable<T> {
        subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): any;
        toPromise<T>(this: IObservable<T>): Promise<T>;
        toPromise<T>(this: IObservable<T>, PromiseCtor: typeof Promise): Promise<T>;
        toPromise<T>(this: IObservable<T>, PromiseCtor: PromiseConstructorLike): Promise<T>;
    }

    interface ISocialService {
        getReaction(socialKey: string): IObservable<IReaction>;
        setReaction(socialKey: string, reaction: IReaction): IObservable<IReaction>;
        getComments(socialKey: string): IObservable<IComment[]>;
        sendComment(socialKey: string, comment: IComment): IObservable<boolean>;
    }

    interface IDataService {
        jsonDateParser(key, value);

        getExpandExpression(
            expandNavigationProperties: string[]
        ): string;

        save(
            dataStoreName: string,
            dataSourceUri: string,
            entity: wy.BaseEntity,
            isNew?: boolean,
            silent?: boolean
        ): IObservable<wy.IODataResponse>;

        remove(
            dataStoreName: string,
            dataSourceUri: string,
            entity: wy.BaseEntity,
            silent?: boolean
        ): IObservable<wy.IODataResponse>;

        restore(
            dataStoreName: string,
            dataSourceUri: string,
            entity: wy.BaseEntity,
            silent?: boolean
        ): IObservable<wy.IODataResponse>;

        triggerOperation(
            dataStoreName: string,
            dataSourceUri: string,
            operationName: string,
            entityId?: PrimaryKey,
            data?: any,
            pictureUrl?: string,
            silent?: boolean
        ): IObservable<any>;

        fetchCount(
            dataStoreName: string,
            dataSourceUri: string,
            filter?: string,
        ): IObservable<number>;

        fetchValue(
            dataStoreName: string,
            dataSourceUri: string,
            filter?: string,
        ): IObservable<any>

        fetchRaw(
            dataStoreName: string,
            dataSourceUri: string,
            filter?: string,
            expand?: string,
            top?: number,
            select?: string,
            orderby?: string,
        ): IObservable<any>;

        fetch(
            dataStoreName: string,
            dataSourceUri: string,
            filter?: string,
            expand?: string,
            top?: number,
            select?: string,
            orderby?: string,
        ): IObservable<wy.BaseEntity[]>;

        fetchData(
            dataStoreName: string,
            dataSourceUri: string,
            filter: string,
            expand: string,
            state: wy.IDataState,
        ): IObservable<wy.IDataResult>;

        fetchOne(
            dataStoreName: string,
            dataSourceUri: string,
            entityId: PrimaryKey,
            filter?: string,
            expand?: string,
        ): IObservable<wy.BaseEntity>;

        fetchFirst(
            dataStoreName: string,
            dataSourceUri: string,
            filter?: string,
            expand?: string,
        ): IObservable<wy.BaseEntity>;

        getInRecycleBinFilter(): string;
        getNotInRecycleBinFilter(): string;
        mergeFilters(filter1: string, filter2: string): string;
    }

    interface IMessageService {
        log(text: string): void;

        modalMessage(title: string, text: string);
        modalConfirmation(title: string, text: string, handler: (confirmed: boolean) => any);

        showProgress(title: string, text: string, pictureUrl?: string);
        hideProgress(): void;

        notify(text: string, style: 'none' | 'success' | 'warning' | 'error' | 'info', icon?: boolean, hideAfter?: number);
    }

    interface IConstantService {
        getConfig(): wy.IConfig;
        getServiceLayerODataUri(dataStoreName?: string, dataSourceUri?: string): string;
        getServiceLayerBlobUri(): string;
        getServiceLayerPreAuthenticateUri(): string;
        getServiceLayerAuthenticateUri(): string;
        getServiceLayerClearTokenUri(): string;
        getServiceLayerRefreshTokenUri(): string;
        getServiceLayerRequestAuthorizationMapsUri(): string;
        getServiceLayerRequestUserSettingsUri(): string;
        getServiceLayerRootUri(): string;
        getHangfireDashboardUri(): string;
        getSwaggerUri(): string;
        getReportServerUri(): string;
        getNamespace(): string;
        getLoginPageUrl(): string;
    }

    interface IUtilService {
        getFileExtension(fileName: string): string;
        setDocumentTitle(title: string): void;
        logout(): void
        logoutIfInvalidJwt(): boolean;
        getValidatedJwt(): wy.Jwt;
        hasValidJwt(): boolean;
        canRefreshJwt(): boolean;
        formatBytes(bytes: number, decimals: number): string;
        formatLookupEntities(data: any[]): string;
        formatJsonProperties(data: string, lineBreaks: boolean): string;
        formatDateTime(data: Date): string;
        formatDate(data: Date): string;
        formatTime(data: Date): string;
        formatMultilineText(data: string): string;
        formatUrl(data: string): string;
        isValidEntityId(value: wy.PrimaryKey): boolean;
        isValidCoords(lat: number, lng: number): boolean;
        isSizeSmall(): boolean;
        isSizeMedium(): boolean;
    }

    interface ILinkService {
        getDownloadLink(blobName: string, size?: number, boxId?: string): string;
        getLocationLink(latitude: number, longitude: number): string;
    }

    interface ILanguageService {
        translate(key: string): string;
    }

    interface IAuthorizationService {
        isAuthorizationMapsEnabled(): boolean;
        refreshAuthorizationMaps(): Promise<void>;
        getAuthorizationMap(): wy.AuthorizationMap;
        isFeatureEnabled(featureKey: string): boolean;
    }

    interface IUserSettingsService {
        refreshUserSettings(): Promise<void>;
        getUserSettings(): wy.UserSetting[];
        getUserSetting(key: string): string;
        isFeatureEnabled(featureKey: string): boolean;

        getCurrency(): string;
    }

    interface IStorageService {
        setValue(key: string, value: any);
        clearValue(key: string);
        getValue(key: string): any;
        getComponentStorageKey(componentIdentifier: string, key: string);
    }

    interface IAuthenticationService {
        preAuthenticate(credentials: wy.Credentials, onSucceed: (tenants: IAvailableTenant[]) => void, onFail: Function);
        authenticate(credentials: wy.Credentials, onSucceed: (jwt: wy.Jwt) => void, onFail: Function);
        refreshToken(onSucceed: (jwt: wy.Jwt) => void, onFail: Function);
    }

    interface IBlobService {
        getImages(handler: (blobs: wy.Blob[]) => any, boxId?: string): void;
        getFiles(handler: (blobs: wy.Blob[]) => any, boxId?: string): void;
        getBlobUri(blob: wy.Blob, boxId?: string, inline?: boolean): string;
        getBlobUriByName(blobName: string, boxId?: string, inline?: boolean): string;
        deleteBlob(blob: wy.Blob, handler: () => any, boxId?: string): void;
        deleteBlobByName(blobName: string, handler: () => any, boxId?: string): void;
        deleteBlobBox(boxId: string, handler: () => any): void;
        copyBlobBox(sourceBoxId: string, destinationBoxId: string, handler: () => any): void;
    }

    interface IRootModule {
    }

    interface IModule {
    }

    interface Credentials {
        userName: string;
        password: string;
        tenant: string;
        verificationCode: string;
        enableRefresh: boolean;
    }

    interface Jwt {
        tenant: string;
        exp: number;
        culture: string;
        role: string;
        roles: string;
        name: string;
        username: string;
        userImage: string;
        eas: number;
        rft: string;
        iss: string;
    }

    interface Blob {
        Name: string;
        Size: number;
        Type: string;
        ContentType: string;
        BoxId: string;
        IsImage: boolean;
        IsPdf: boolean;
    }

    interface AuthorizationMap {
        AppName: string;
        Roles: string[];
        AllowedAuthorizations: string[];
        DeniedAuthorizations: string[];
    }

    interface UserSetting {
        Key: string;
        Value: string;
    }

    interface AuthorizationMapEntry {
        PermissionKey: string;
        Allow: boolean;
    }

    interface IAppLauncherAppConfig {
        Title: string;
        Name: string;
        Url: string;
        PictureUrl: string;
        Description: string;
        Color: string;
    }

    interface IAppLauncherConfig {
        value: IAppLauncherAppConfig;
    }

    type PrimaryKey = number | string;

    interface BaseEntity {
        Id: PrimaryKey;
        DeleteStatus?: number;
		Name?: string;
    }
}

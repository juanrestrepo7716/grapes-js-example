import { Injectable, Inject } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { EventService } from './event.service';
import { HttpClient } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthenticationService extends BaseHttpService implements wy.IAuthenticationService {

    constructor(
        @Inject('IConstantService')
        private _cs: wy.IConstantService,

        private http: HttpClient,

        private _es: EventService) {
        super();
    }

    public preAuthenticate(credentials: wy.Credentials, onSucceed: (tenants: wy.IAvailableTenant[]) => void, onFail: Function) {
        const preAuthUri = this._cs.getServiceLayerPreAuthenticateUri();

        this.http.post<wy.IODataResponse>(preAuthUri, { userName: credentials.userName, password: credentials.password }, BaseHttpService.AsHttpJson())
            .subscribe(
                response => {
                    if (response == null || response.value == null || response.value.length == 0) {
                        onFail();
                    }
                    else {
                        console.log('Got pre-authenticate result.', response);
                        onSucceed(response.value);
                    }
                },
                err => {
                    console.log(err);

                    onFail();
                }
            );
    }

    public authenticate(credentials: wy.Credentials, onSucceed: (jwt: wy.Jwt) => void, onFail: Function) {
        const authUri = this._cs.getServiceLayerAuthenticateUri();

        this.http.post<wy.IODataResponse>(authUri + '?tenant=' + credentials.tenant, credentials, BaseHttpService.AsHttpJson())
            .subscribe(
                response => {
                    if (response == null || response.value == null || response.value == '') {
                        onFail();
                    }
                    else {
                        console.log('Got token.', response);

                        const jwt: wy.Jwt = jwt_decode(response.value);
                        this._es.userAuthenticated.next(jwt);
                        onSucceed(jwt);
                    }
                },
                err => {
                    console.log(err);

                    onFail();
                }
            );
    }

    public refreshToken(onSucceed: (jwt: wy.Jwt) => void, onFail: Function) {
        const refreshTokenUri = this._cs.getServiceLayerRefreshTokenUri();

        this.http.post<wy.IODataResponse>(refreshTokenUri, null, BaseHttpService.AsHttpJson())
            .subscribe(
                response => {
                    if (response == null || response.value == null || response.value == '') {
                        onFail();
                    }
                    else {
                        console.log('Got refreshed token.', response);

                        const jwt: wy.Jwt = jwt_decode(response.value);
                        onSucceed(jwt);
                    }
                },
                err => {
                    console.log(err);

                    onFail();
                }
            );
    }
}

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';
import { map } from "rxjs/operators";
import { Observable, EMPTY } from 'rxjs';

@Injectable()
export class SocialService extends BaseHttpService implements wy.ISocialService {

    constructor(
        @Inject('IUtilService')
        private _us: wy.IUtilService,

        @Inject('IConstantService')
        private _cs: wy.IConstantService,

        private http: HttpClient) {
        super();
    }

    getReaction(socialKey: string): Observable<wy.IReaction> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };

        const baseUri = this._cs.getServiceLayerODataUri();
        let uri = `${baseUri}/GetReaction`;

        return this.http
            .post<wy.IODataResponse>(uri, {
                socialKey: socialKey
            }, BaseHttpService.AsHttpJson())
            .pipe(map(response => {
                // TODO: legacy, remove when on ASP.NET Core
                if (response && response.value instanceof Array) {
                    return response.value[0];
                }
                else {
                    return response.value;
                }
            }));
    }

    setReaction(socialKey: string, reaction: wy.IReaction): Observable<wy.IReaction> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };

        const baseUri = this._cs.getServiceLayerODataUri();
        let uri = `${baseUri}/SetReaction`;

        return this.http
            .post<wy.IODataResponse>(uri, {
                socialKey: socialKey,
                reactionType: reaction.ReactionType,
                motivation: reaction.Motivation
            }, BaseHttpService.AsHttpJson())
            .pipe(map(response => {
                // TODO: legacy, remove when on ASP.NET Core
                if (response && response.value instanceof Array) {
                    return response.value[0];
                }
                else {
                    return response.value;
                }
            }));
    }

    getComments(socialKey: string): Observable<wy.IComment[]> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };

        const baseUri = this._cs.getServiceLayerODataUri();
        let uri = `${baseUri}/GetComments`;

        return this.http
            .post(uri, {
                socialKey: socialKey
            }, BaseHttpService.AsHttpText())
            .pipe(map(response => JSON.parse(response, this.jsonDateParser) as wy.IODataResponse))
            .pipe(map(response => {
                return response.value;
            }));
    }

    sendComment(socialKey: string, comment: wy.IComment): Observable<boolean> {
        if (this._us.logoutIfInvalidJwt()) { return EMPTY; };

        const baseUri = this._cs.getServiceLayerODataUri();
        let uri = `${baseUri}/SendComment`;

        return this.http
            .post<wy.IODataResponse>(uri, {
                socialKey: socialKey,
                text: comment.Text
            }, BaseHttpService.AsHttpJson())
            .pipe(map(response => {
                return response.value;
            }));
    }
}

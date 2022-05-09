import { HttpHeaders } from '@angular/common/http';

export abstract class BaseHttpService {

    public jsonDateParser(key, value) {
        const isoDateFormatPattern = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/;

        if (typeof value === 'string') {
            const isDate = isoDateFormatPattern.exec(value);
            if (isDate) {
                return new Date(value);
            }
        }
        return value;
    }

    public static AsHttpJson(): {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        responseType: 'json';
        withCredentials?: boolean;
    } {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8'
            }),
            withCredentials: true,
            responseType: 'json'
        };
    }

    public static AsHttpText(): {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        responseType: 'text';
        withCredentials?: boolean;
    } {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8'
            }),
            withCredentials: true,
            responseType: 'text'
        };
    }

    constructor() {
    }
}

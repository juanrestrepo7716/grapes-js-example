import { Injectable } from "@angular/core";

const STORAGE_KEY_PREFIX = 'STORAGE_';

@Injectable()
export class StorageService implements wy.IStorageService {    
    constructor() {
    }

    setValue(key: string, value: any) {
        localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    }

    clearValue(key: string) {
        localStorage.removeItem(STORAGE_KEY_PREFIX + key);
    }

    getValue(key: string): any {
        const value = localStorage.getItem(STORAGE_KEY_PREFIX + key);
        if (value) {
            return JSON.parse(value);
        }

        return null;
    }

    getComponentStorageKey(componentIdentifier: string, key: string) {
        return `${componentIdentifier}.${key}`;
    }
}

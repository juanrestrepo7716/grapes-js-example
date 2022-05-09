import { Injectable } from "@angular/core";

@Injectable()
export class LanguageService implements wy.ILanguageService {
    constructor() {
    }

    public translate(key: string): string {
        // TODO: find a better way
        const elements = document.querySelectorAll('.wy-dynamic-translations');

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i].querySelector(`.${key}`);

            if (element) {
                return element.innerHTML;
            }
        }

        console.log(`Translation not found.`, key);

        return '';
    }
}

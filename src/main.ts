//::Bag::All
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
if (environment.production) {
    enableProdMode();
}
const stamp = new Date().getTime();
console.log('This application is created with wyStack and generated by a software robot. ==> http://www.wystack.com');
console.log('Copyright © 2021 Estiom ==> https://estiom.com');
fetch('/config.json?' + stamp)
    .then(resp => resp.json())
    .then((config: wy.IConfig) => {
        AppModule.config = config; // provide configuration
        platformBrowserDynamic()
            .bootstrapModule(AppModule, {
                preserveWhitespaces: false
            })
            .catch(err => console.log(err));
    });

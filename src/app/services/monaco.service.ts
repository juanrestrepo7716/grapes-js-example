import { Injectable } from '@angular/core';

declare global {
    interface Window {
        require: any;
        monaco: any;
    }
}

/**
 * Service to load Monaco dependencies.
 * https://github.com/Microsoft/monaco-editor/issues/18#issuecomment-261289582
 */
@Injectable()
export class MonacoService {
    private _loaded = false;
    private _loadPromise: Promise<void>;

    constructor() {
        this._loadPromise = new Promise<void>(resolve => {
            // Fast path - Monaco is already loaded
            if (typeof (window.monaco) === 'object') {
                resolve();
                return;
            }

            const onGotAmdLoader = () => {
                // Load Monaco
                window.require.config({ paths: { 'vs': 'assets/monaco/vs' } });

                window.require(['vs/editor/editor.main'], () => {
                    this._loaded = true;
                    resolve();
                });
            };

            // Load AMD loader if necessary
            if (!window.require) {
                const loaderScript = document.createElement('script');
                loaderScript.type = 'text/javascript';
                loaderScript.src = 'assets/monaco/vs/loader.js';
                loaderScript.addEventListener('load', onGotAmdLoader);
                document.body.appendChild(loaderScript);
            } else {
                onGotAmdLoader();
            }
        });
    }

    get monacoLoaded() {
        return this._loaded;
    }

    /**
     * Returns promise that will be fulfilled when Monaco is available.
     */
    waitForMonaco(): Promise<void> {
        return this._loadPromise;
    }
}

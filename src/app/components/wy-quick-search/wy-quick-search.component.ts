import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';

@Component({
    selector: 'wy-quick-search',
    templateUrl: './wy-quick-search.component.html',
    styleUrls: [
        './wy-quick-search.component.scss'
    ]
})
export class WyQuickSearchComponent implements OnInit {

    @Input() storageKey: string;

    @Output() quickSearchChange: EventEmitter<any> = new EventEmitter();

    public search: string;

    private _searchDelay;

    constructor(
        @Inject('IStorageService')
        private _st: wy.IStorageService) {
        this.search = '';
    }

    ngOnInit() {
        this.loadQuickSearch();
    }

    public triggerQuickSearchChangeHandlerWithDelay() {
        clearTimeout(this._searchDelay);

        this._searchDelay = setTimeout(() => {
            this.triggerQuickSearchChangeHandler();
        }, 500);
    }

    public triggerQuickSearchChangeHandler() {
        this.saveQuickSearch();
        this.quickSearchChange.emit(this.search);
    }

    public clearQuickSearch() {
        this.search = '';
        this.triggerQuickSearchChangeHandler();
    }

    public getFilterFromQuickSearch(fields: string[]) {
        if (this.search == '' || this.search == null) {
            return null;
        }

        if (this.search.match(/^#[0-9][0-9]*/g)) {
            // search by Id
            const id = parseInt(this.search.substr(1));

            return `Id eq ${id}`;
        }
        else {
            // search by quick search fields
            let result = '';
            for (let i = 0; i < fields.length; i++) {
                if (i > 0) {
                    result += ' or ';
                }
                result += `contains(${fields[i]},'${this.search}')`;
            }

            return '(' + result + ')';
        }
    }

    private saveQuickSearch() {
        if (this.storageKey) {
            this._st.setValue(this.storageKey, this.search);
        }
    }

    private loadQuickSearch() {
        if (this.storageKey) {
            const quickSearch = this._st.getValue(this.storageKey);

            if (quickSearch) {
                this.search = quickSearch;
            }
        }
    }
}

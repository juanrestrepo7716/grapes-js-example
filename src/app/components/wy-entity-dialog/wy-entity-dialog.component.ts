import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'wy-entity-dialog',
    templateUrl: './wy-entity-dialog.component.html',
    styleUrls: [
        './wy-entity-dialog.component.scss'
    ]
})
export class WyEntityDialogComponent {

    @Input() public title: string;
    @Input() public entity: wy.BaseEntity;
    @Input() public readonly: boolean;
    @Input() public isNew: boolean;
    @Input() public color: string;
    @Input() public icon: string = 'fas fa-dot-circle';

    @Output() save: EventEmitter<wy.ISaveEvent> = new EventEmitter();
    @Output() cancel: EventEmitter<any> = new EventEmitter();

    public dialogWidth: number;
    public dialogHeight: number;

    constructor() {
        if (window.innerWidth > 992 && window.innerHeight > 720) {
            this.dialogWidth = window.innerWidth - 300;
            this.dialogHeight = window.innerHeight - 100;
        }
        else {
            this.dialogWidth = window.innerWidth - 10;
            this.dialogHeight = window.innerHeight - 10;
        }
    }

    public cancelHandler() {
        this.cancel.emit();
    }

    public saveHandler(saveEvent: wy.ISaveEvent) {
        this.save.emit(saveEvent);
    }
}

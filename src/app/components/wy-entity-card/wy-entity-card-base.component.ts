//::Bag::Default
import { Input, Inject, OnInit, Output, EventEmitter, Directive } from '@angular/core';
import { WyBaseComponent } from '../wy-base.component';
@Directive()
export abstract class WyEntityCardBaseComponent extends WyBaseComponent implements OnInit {
    @Input() public entity: wy.BaseEntity;
    @Input() public selected: boolean;
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    @Output() onDelete: EventEmitter<any> = new EventEmitter();
    public pictureUri: string = 'https://estiom.com/cdn/wyStack/no-picture.png';
    protected abstract getPicturePropertyType(): string;
    protected abstract getPicturePropertyName(): string;
    constructor(
        @Inject('IBlobService')
        private _bs: wy.IBlobService
    ) {
        super();
    }
    ngOnInit() {
        this.loadPicture();
    }
    triggerOnDelete() {
        this.onDelete.emit();
    }
    public triggerOnOpen() {
        this.onSelect.emit();
    }
    private loadPicture() {
        const picturePropertyName = this.getPicturePropertyName();
        const picturePropertyType = this.getPicturePropertyType();
        const value = this.entity[picturePropertyName];
        if (!value) {
            return;
        }
        if (picturePropertyType == 'PictureUrl') {
            this.pictureUri = value;
        }
        if (picturePropertyType == 'Pictures' || picturePropertyType == 'Picture') {
            this._bs.getFiles(async (blobs) => {
                if (blobs.length > 0) {
                    this.pictureUri = this._bs.getBlobUriByName(blobs[0].Name, blobs[0].BoxId, true);
                }
            }, value);
        }
        if (picturePropertyType == 'PictureReference') {
            this.pictureUri = this._bs.getBlobUriByName(value);
        }
    }
}

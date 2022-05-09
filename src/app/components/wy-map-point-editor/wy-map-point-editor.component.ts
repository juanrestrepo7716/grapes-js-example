//::Bag::Default
import { Component, Input, Inject, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { FormGroupDirective, ControlContainer, FormControl } from '@angular/forms';
import { marker, featureGroup, divIcon, Marker } from 'leaflet';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MAP_LAYERS } from '../constants';
@Component({
    selector: 'wy-map-point-editor',
    templateUrl: './wy-map-point-editor.component.html',
    styleUrls: [
        './wy-map-point-editor.component.scss'
    ],
    viewProviders: [{
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }]
})
export class WyMapPointEditorComponent implements OnInit, OnChanges, OnDestroy {
    private _map: L.Map;
    public options = {
        layers: []
    };
    public layersControl = {
        baseLayers: {
            'OpenStreetMap': MAP_LAYERS.osm,
            'World Imagery': MAP_LAYERS.worldImagery,
        }
    }
    public layers: any[] = null;
    public formControlLat: FormControl;
    public formControlLng: FormControl;
    private _isInitiated = false;
    private _formControlName: string;
    private _editMarker: Marker;
    private _formControlSubscription: Subject<any>;
    @Input() public entityId: string;
    constructor(private parentForm: FormGroupDirective,
        @Inject('IUtilService')
        protected us: wy.IUtilService
    ) {
        this.options.layers.push(MAP_LAYERS.osm);
    }
    @Input()
    set controlName(value: string) {
        this._formControlName = value;
        this.init(true);
    }
    ngOnInit() {
        this.init(true);
        this._isInitiated = true;
    }
    ngOnChanges() {
        if (this._isInitiated) {
            this.init(true);
        }
    }
    private renewSubscriptions(controls: FormControl[]) {
        if (this._formControlSubscription) {
            this._formControlSubscription.next();
            this._formControlSubscription.complete();
        }
        this._formControlSubscription = new Subject();
        for (let control of controls) {
            control.valueChanges
                .pipe(takeUntil(this._formControlSubscription))
                .subscribe(() => {
                    this.init(false);
                    this.autoFitBounds();
                });
        }
    }
    private init(renewSubscriptions: boolean) {
        if (this._formControlName) {
            this.formControlLat = this.parentForm.form.get(this._formControlName + '_Latitude') as FormControl;
            this.formControlLng = this.parentForm.form.get(this._formControlName + '_Longitude') as FormControl;
            if (this.formControlLat && this.formControlLng) {
                if (renewSubscriptions) {
                    this.renewSubscriptions([this.formControlLat, this.formControlLng]);
                }
                let lat = this.formControlLat.value;
                let lng = this.formControlLng.value;
                // validate coords
                if (!this.us.isValidCoords(lat, lng)) {
                    lat = 0;
                    lng = 0;
                }
                if (this._editMarker) {
                    this._editMarker.off();
                }
                this._editMarker = marker([lat, lng], { draggable: true, icon: this.getIcon('rgba(57, 194, 44, 1)') });
                this._editMarker.on('dragend', () => {
                    this.formControlLat.setValue(this._editMarker.getLatLng().lat.toString(), { emitEvent: false });
                    this.formControlLng.setValue(this._editMarker.getLatLng().lng.toString(), { emitEvent: false });
                    this.formControlLat.markAsDirty();
                    this.formControlLng.markAsDirty();
                });
                this.layers = [this._editMarker];
                this.autoFitBounds();
            }
        }
    }
    public onMapReady(map: L.Map) {
        this._map = map;
        this._map.on('click', (event: any) => {
            this.formControlLat.setValue(event.latlng.lat.toString(), { emitEvent: false });
            this.formControlLng.setValue(event.latlng.lng.toString(), { emitEvent: false });
            this.formControlLat.markAsDirty();
            this.formControlLng.markAsDirty();
            this._editMarker.setLatLng(event.latlng);
        });
        this.autoFitBounds();
    }
    private autoFitBounds() {
        if (this._map && this.layers) {
            const group = featureGroup(this.layers);
            const bounds = group.getBounds();
            if (bounds.isValid()) {
                this._map.fitBounds(bounds);
                this._map.setZoom(10);
                this._map.invalidateSize();
            }
        }
    }
    ngOnDestroy() {
        try {
            if (this._map) {
                this._map.remove();
            }
        }
        catch (ex) {
            // ignore
        }
    }
    private getIcon(color: string): any {
        return divIcon({
            className: 'wy-map-marker',
            iconAnchor: [0, 24],
            popupAnchor: [0, -36],
            html: `<span style="background-color: ${color};
                width: 1.5rem;
                height: 1.5rem;
                display: block;
                left: -.75rem;
                top: -.75rem;
                position: relative;
                border-radius: 2rem 2rem 0;
                transform: rotate(45deg);
                border: 1px solid #FFFFFF" />`
        });
    }
}

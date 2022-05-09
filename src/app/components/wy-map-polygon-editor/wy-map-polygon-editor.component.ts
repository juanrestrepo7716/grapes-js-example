//::Bag::Default
import { Component, Input, Inject, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { FormGroupDirective, ControlContainer, FormControl } from '@angular/forms';
import * as L from 'leaflet';
import { featureGroup, FeatureGroup, DrawEvents, Polygon } from 'leaflet';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MAP_LAYERS } from '../constants';
@Component({
    selector: 'wy-map-polygon-editor',
    templateUrl: './wy-map-polygon-editor.component.html',
    styleUrls: [
        './wy-map-polygon-editor.component.scss'
    ],
    viewProviders: [{
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }]
})
export class WyMapPolygonEditorComponent implements OnInit, OnChanges, OnDestroy {
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
    public editableLayers: FeatureGroup = featureGroup();
    public drawOptions = {
        edit: {
            featureGroup: this.editableLayers
        },
        draw: {
            polygon: true,
            marker: false,
            polyline: false,
            circle: false,
            circlemarker: false,
            rectangle: false
        },
    };
    public formControl: FormControl;
    private _isInitiated = false;
    private _formControlName: string;
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
    private renewSubscriptions(control: FormControl) {
        if (this._formControlSubscription) {
            this._formControlSubscription.next();
            this._formControlSubscription.complete();
        }
        this._formControlSubscription = new Subject();
        control.valueChanges
            .pipe(takeUntil(this._formControlSubscription))
            .subscribe(() => {
                this.init(false);
                this.autoFitBounds();
            });
    }
    private getAreaControl() {
        return this.parentForm.form.get(this._formControlName + '_Area');
    }
    private init(renewSubscriptions: boolean) {
        if (this._formControlName) {
            this.formControl = this.parentForm.form.get(this._formControlName) as FormControl;
            if (this.formControl) {
                this.editableLayers.clearLayers();
                if (renewSubscriptions) {
                    this.renewSubscriptions(this.formControl);
                }
                let polygonJson = this.formControl.value;
                if (polygonJson) {
                    var polygon = L.polygon(JSON.parse(polygonJson));
                    this.editableLayers.addLayer(polygon);
                }
                this.autoFitBounds();
            }
        }
    }
    public onDrawCreated(e: DrawEvents.Created) {
        let polygon = e.layer as Polygon;
        this.editableLayers.addLayer(polygon);
        this.updatePolygon(polygon);
    }
    public onDrawEdited(e: DrawEvents.Edited) {
        let layers = e.layers.getLayers();
        if (layers.length > 0) {
            let polygon = layers[0] as Polygon;
            this.updatePolygon(polygon);
        }
    }
    private updatePolygon(polygon: L.Polygon<any>) {
        const latLngs = polygon.getLatLngs();
        if (latLngs.length > 0) {
            const firstLatLng = latLngs[0];
            const polygonJson = JSON.stringify(firstLatLng);
            this.formControl.setValue(polygonJson, { emitEvent: false });
            this.formControl.markAsDirty();
            // calculate area            
            const area = L.GeometryUtil.geodesicArea(firstLatLng as L.LatLng[]);
            const areaControl = this.getAreaControl();
            areaControl.setValue(area, { emitEvent: false });
            areaControl.markAsDirty();
        }
    }
    public onMapReady(map: L.Map) {
        this._map = map;
        this.autoFitBounds();
    }
    private autoFitBounds() {
        if (this._map && this.editableLayers) {
            const bounds = this.editableLayers.getBounds();
            if (bounds.isValid()) {
                this._map.fitBounds(bounds);
                this._map.invalidateSize();
            }
            else {
                this._map.setZoom(10);
                this._map.panTo(new L.LatLng(0, 0));
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
}

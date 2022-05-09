import { Component, OnInit, Inject, ViewEncapsulation, Input, OnChanges, SimpleChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { WyBaseComponent } from '../wy-base.component';
import { Router } from '@angular/router';
import { marker, divIcon, featureGroup, polygon, Polygon, Marker } from 'leaflet';
import { MAP_LAYERS, MAP_WEATHER_LAYERS } from '../constants';
@Component({
    selector: 'wy-component-mymap',
    templateUrl: './wy-component-mymap.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './wy-map.component.scss'
    ]
})
export class WyMapComponent_MyMap extends WyBaseComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public filter: string;
    @Input() baseLayerMode: 'map' | 'satellite' = 'map';
    @Input() pointMode: 'markers' | 'polygon' = 'markers';
    @Input() groupBy: string;
    @Output() onMarkerCreated: EventEmitter<any> = new EventEmitter();
    public isBusy: boolean = true;
    private _isInitiated = false;
    private _map: L.Map;
    public options = {
        layers: []
    };
    public layersControl = {
        baseLayers: {
            'OpenStreetMap': MAP_LAYERS.osm,
            'World Imagery': MAP_LAYERS.worldImagery,
        },
        overlays: {
            'Weather: Clouds': MAP_WEATHER_LAYERS.clouds,
            'Weather: Pressure': MAP_WEATHER_LAYERS.pressure,
            'Weather: Wind': MAP_WEATHER_LAYERS.wind,
        }
    }
    public layers: any[] = null;
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
    constructor(
        @Inject('IDataService')
        protected ds: wy.IDataService,
        @Inject('IUtilService')
        protected us: wy.IUtilService,
        private _router: Router) {
        super();
    }
    async ngOnInit() {
        await this.loadData();
        if (this.baseLayerMode == 'map') {
            this.options.layers.push(MAP_LAYERS.osm);
        }
        else {
            this.options.layers.push(MAP_LAYERS.worldImagery);
        }
        this._isInitiated = true;
    }
    async ngOnChanges(changes: SimpleChanges) {
        if (this._isInitiated) {
            await this.loadData();
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
    private resolveBinding(binding: string, entity: wy.BaseEntity) {
        // TODO: use advanced library to do this/standard platform feature?
        return binding.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : null;
        }, entity || self);
    }
    private async loadData() {
        const dataSourceUri = this.getDataSourceUri();
        if (dataSourceUri) {
            const mergedFilter = this.ds.mergeFilters(this.filter, this.ds.getNotInRecycleBinFilter());
            const entities = await this.ds.fetch(this.getDataStoreName(), dataSourceUri, mergedFilter, null, null, null, '').toPromise();
            if (entities.length > 0) {
                const newMarkers: { [key: string]: Marker<any>; } = {};
                const newPolygons: { [key: string]: Polygon<any>; } = {};
                for (const entity of entities) {
                    const lat = this.resolveBinding('Location_Latitude', entity);
                    const lng = this.resolveBinding('Location_Longitude', entity);
                    // validate coords
                    if (this.us.isValidCoords(lat, lng)) {
                        let groupBy = entity.Id;
                        if (this.groupBy) {
                            groupBy = this.resolveBinding(this.groupBy, entity);
                        }
                        const title = this.resolveBinding('Name', entity);
                        const value1 = this.resolveBinding('Owner', entity);
                        const value2 = this.resolveBinding('', entity);
                        const value3 = this.resolveBinding('', entity);
                        if (this.pointMode == 'markers') {
                            if (!newMarkers[groupBy]) {
                                const m = marker([lat, lng], { title: title, icon: this.getIcon('rgba(57, 194, 44, 1)') });
                                m.bindPopup(this.getPopupContents(entity, title, value1, value2, value3)).openPopup();
                                m.on('click', () => {
                                    m.getPopup().openPopup();
                                });
                                this.onMarkerCreated.emit({
                                    entity: entity,
                                    marker: m
                                });
                                newMarkers[groupBy] = m;
                            }
                        }
                        else {
                            if (!newPolygons[groupBy]) {
                                const p = polygon([], { color: this.getRandomColor() })
                                p.bindPopup(this.getPopupContents(entity, title, value1, value2, value3)).openPopup();
                                p.on('click', () => {
                                    p.getPopup().openPopup();
                                });
                                newPolygons[groupBy] = p;
                            }
                            newPolygons[groupBy].addLatLng([lat, lng]);
                        }
                    }
                }
                if (this.pointMode == 'markers') {
                    this.layers = Object.values(newMarkers);
                }
                else {
                    this.layers = Object.values(newPolygons);
                }
            }
        }
        this.isBusy = false;
    }
    private getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    public onMapClick(event) {
        const target: Element = event.srcTarget || event.target;
        if (target.tagName !== 'A') {
            return;
        }
        const href = target.getAttribute('href');
        this._router.navigateByUrl(href);
        return false;
    }
    private getPopupContents(entity: wy.BaseEntity, title: string, value1: any, value2: any, value3: any) {
        const template = ``; // TODO: support Angular template
        if (!template) {
            return `<a class="wy-app-color-important" href="/app/projects/${entity.Id}">${title}</a>
                ${value1 ? ' • ' + value1 : ''}
                ${value2 ? ' • ' + value2 : ''}
                ${value3 ? ' • ' + value3 : ''}
            `;
        }
        else {
            return template;
        }
    }
    public onMapReady(map: L.Map) {
        this._map = map;
        if (this.layers) {
            const group = featureGroup(this.layers);
            const bounds = group.getBounds();
            if (map && bounds.isValid()) {
                map.fitBounds(bounds);
                map.invalidateSize();
            }
        }
    }
    protected getDataStoreName(): string {
        return 'default';
    }
    protected getDataSourceUri(): string {
        return '/Projects';
    }
}

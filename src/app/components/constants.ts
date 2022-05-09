//::Bag::Default
import { tileLayer } from 'leaflet';
import './Leaflet.GoogleMutant.js';
export const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
export const PRIMARY_KEY_NULL_VALUE = EMPTY_GUID;
export const MAP_LAYERS = {
    worldImagery: tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        minZoom: 1,
        maxZoom: 18,
        maxNativeZoom: 16,
    }),
    osm: tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 18,
    }),
    googleMaps: L.gridLayer.googleMutant({
        type: 'roadmap'
    }),
    googleSatellite: L.gridLayer.googleMutant({
        type: 'satellite'
    }),
    googleTerrain: L.gridLayer.googleMutant({
        type: 'terrain'
    })
}
export const MAP_WEATHER_LAYERS = {
    clouds: tileLayer('http://{s}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=2890209cdb7d7e64a1e73a7f7aa5248d', {
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
        opacity: 0.5
    }),
    pressure: tileLayer('http://{s}.tile.openweathermap.org/map/pressure/{z}/{x}/{y}.png?appid=2890209cdb7d7e64a1e73a7f7aa5248d', {
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
        opacity: 0.5
    }),
    wind: tileLayer('http://{s}.tile.openweathermap.org/map/wind/{z}/{x}/{y}.png?appid=2890209cdb7d7e64a1e73a7f7aa5248d', {
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
        opacity: 0.5
    }),
}
export const PortalHostDivId = 'PORTAL_HOST';
export const GridColumnsConfigurationStorageKey = 'GRID_COLUMNS';
export const QuickSearchStorageKey = 'QUICK_SEARCH';
export const PageSizeStorageKey = 'PAGE_SIZE';
export const SortStorageKey = 'SORT';
export const AuthorizationMapStorageKey = 'AUTH_MAP';
export const UserSettingsStorageKey = 'USER_SETTINGS';

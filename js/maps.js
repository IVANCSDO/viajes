import {escapeHTML as e, mapsUrl, externalLink} from './utils.js';
import {dayTouchesPlace,modeLabels} from './trip.js';
const instances = new Set();
export function clearMaps() { instances.forEach(map => map.remove()); instances.clear(); }
export function createMap(elementId,data,{dayId = null, placeId = null, compact = false} = {}) {
  const element = document.getElementById(elementId);
  if (!element) return;
  if (!window.L) { element.innerHTML = '<p class="map-fallback">El mapa no está disponible. Puedes consultar los lugares y sus enlaces a Google Maps.</p>'; return; }
  const L = window.L;
  const map = L.map(element, {scrollWheelZoom:false, zoomControl:!compact});
  instances.add(map);
  // Leaflet tracks window resizing; also track changes to the container itself.
  if (window.ResizeObserver) {
    const observer = new window.ResizeObserver(() => map.invalidateSize({pan:false}));
    observer.observe(element);
    map.on('unload', () => observer.disconnect());
  }
  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom:18});
  let warned = false;
  tiles.on('tileerror', () => { if (!warned) { warned = true; const hint = document.createElement('p'); hint.className='tile-warning'; hint.textContent='El fondo del mapa necesita conexión a Internet.'; element.append(hint); } });
  tiles.addTo(map);
  const day = data.dayById.get(dayId);
  const selectedIds = day ? new Set([day.originId,day.destinationId,...day.stops.map(stop => stop.placeId),...day.travelLegs.flatMap(leg => [leg.originId,leg.destinationId]),data.accommodationById.get(day.overnightId)?.placeId]) : null;
  const places = data.places.filter(place => placeId ? place.id === placeId : !selectedIds || selectedIds.has(place.id));
  const features = data.routes.features.filter(feature => !placeId && (!dayId || feature.properties.dayId === dayId));
  const routeLayer = L.geoJSON(features, {style:feature => ({color:['ferry','boat'].includes(feature.properties.mode) ? '#478398' : feature.properties.mode === 'public' ? '#a47745' : feature.properties.mode === 'undecided' ? '#ab813d' : '#315d4b',weight:3,opacity:.85,dashArray:feature.properties.geometryStatus === 'verified' ? null : '7 8'}),onEachFeature:(feature,layer) => {
    const routeDay = data.dayById.get(feature.properties.dayId);
    layer.bindPopup(`<strong>Día ${routeDay.number} · ${e(modeLabels[feature.properties.mode])}</strong><p>${e(feature.properties.geometryStatus === 'verified' ? 'Trazado verificado' : 'Conexión esquemática, no apta para navegar.')}</p><p>${e(feature.properties.note || '')}</p><a href="#dia/${e(routeDay.id)}">Ver jornada</a>`);
  }}).addTo(map);
  const bounds = L.latLngBounds([]);
  places.forEach(place => {
    const label = day?.number ?? data.days.find(d => dayTouchesPlace(d,place.id,data))?.number ?? '·';
    const stop = day?.stops.find(stop => stop.placeId === place.id);
    const status = stop ? stop.priority === 'opcional' ? 'Visita opcional' : stop.status === 'acordada' ? 'Visita acordada en el plan' : 'Visita provisional' : 'Punto del recorrido';
    L.marker(place.coordinates, {title:place.name, icon:L.divIcon({className:`trip-marker ${stop?.priority === 'opcional' ? 'optional-marker' : ''}`,html:`<span>${label}</span>`,iconSize:[28,28],iconAnchor:[14,14]})}).addTo(map).bindPopup(`<strong>${e(place.name)}</strong><p>${e(place.region)} · Coordenadas aproximadas</p><p>${status}</p><a href="#lugar/${e(place.id)}">Ver lugar</a><br>${externalLink(mapsUrl(place),'Google Maps')}`);
    bounds.extend(place.coordinates);
  });
  if (routeLayer.getBounds().isValid()) bounds.extend(routeLayer.getBounds());
  if (bounds.isValid()) map.fitBounds(bounds,{padding:[35,35],maxZoom:placeId || places.length === 1 ? 10 : 8});
  else map.setView([56.7,-4.8],7);
  return map;
}

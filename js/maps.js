import {escapeHTML as e, mapsUrl, externalLink} from './utils.js';
import {dayTouchesPlace,placeBelongsTo,overnightLabel,modeLabels} from './trip.js';
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
  const places = data.places.filter(place => placeId ? place.id === placeId : selectedIds ? selectedIds.has(place.id) : data.days.some(day => dayTouchesPlace(day,place.id,data)));
  const features = data.routes.features.filter(feature => !placeId && (!dayId || feature.properties.dayId === dayId));
  const routeLayer = L.geoJSON(features, {style:feature => ({color:['ferry','boat'].includes(feature.properties.mode) ? '#478398' : feature.properties.mode === 'public' ? '#a47745' : feature.properties.mode === 'undecided' ? '#ab813d' : '#315d4b',weight:3,opacity:.85,dashArray:feature.properties.geometryStatus === 'verified' ? null : '7 8'}),onEachFeature:(feature,layer) => {
    const routeDay = data.dayById.get(feature.properties.dayId);
    layer.bindPopup(`<strong>Día ${routeDay.number} · ${e(modeLabels[feature.properties.mode])}</strong><p>${e(feature.properties.geometryStatus === 'verified' ? 'Trazado verificado' : 'Conexión esquemática, no apta para navegar.')}</p><p>${e(feature.properties.note || '')}</p><a href="#dia/${e(routeDay.id)}">Ver jornada</a>`);
  }}).addTo(map);
  const bounds = L.latLngBounds([]);
  places.forEach(place => {
    const contextDays = day ? [day] : data.days;
    const visits = contextDays.flatMap(d => d.stops.filter(stop => placeBelongsTo(stop.placeId,place.id,data)));
    const nights = contextDays.filter(d => data.accommodationById.get(d.overnightId)?.placeId === place.id);
    const role = visits.length ? nights.length ? 'mixed' : 'visit' : nights.length ? 'sleep' : 'transit';
    const roleLabel = {visit:'Visita',sleep:'Pernocta prevista',mixed:'Visita y pernocta prevista',transit:'Punto de paso'}[role];
    const label = day?.number ?? data.days.find(d => dayTouchesPlace(d,place.id,data))?.number ?? '·';
    const optional = visits.length > 0 && visits.every(stop => stop.priority === 'opcional');
    const status = visits.length ? optional ? 'Visita opcional' : visits.every(stop => stop.status === 'acordada') ? 'Visita acordada en el plan' : 'Visita prevista en el plan' : '';
    const stayDetails = nights.map(d => {
      const stay = data.accommodationById.get(d.overnightId);
      return `<p><strong>Noche ${d.number}</strong> · ${e(overnightLabel(d,data))}<br>${e(stay.selectionStatus === 'elegida' ? 'Alojamiento elegido' : 'Alojamiento por elegir')} · ${e(stay.reservationStatus === 'confirmada' ? 'Reserva confirmada' : 'Sin reserva confirmada')}</p>`;
    }).join('');
    const markerLabel = `${place.name} · ${roleLabel}${optional ? ' · Visita opcional' : ''}`;
    L.marker(place.coordinates, {title:markerLabel, alt:markerLabel, zIndexOffset:nights.length ? 500 : 0, icon:L.divIcon({className:`trip-marker marker-${role} ${optional ? 'optional-marker' : ''}`,html:`<span>${e(label)}${nights.length ? '<small aria-hidden="true">☾</small>' : ''}</span>`,iconSize:[28,28],iconAnchor:[14,14]})}).addTo(map).bindPopup(`<strong>${e(place.name)}</strong><p>${e(place.region)} · Coordenadas aproximadas</p><p>${e(roleLabel)}${status ? ` · ${e(status)}` : ''}</p>${stayDetails}<a href="#lugar/${e(place.id)}">Ver lugar</a><br>${externalLink(mapsUrl(place),'Google Maps')}`);
    bounds.extend(place.coordinates);
  });
  if (routeLayer.getBounds().isValid()) bounds.extend(routeLayer.getBounds());
  if (bounds.isValid()) map.fitBounds(bounds,{padding:[35,35],maxZoom:placeId || places.length === 1 ? 10 : 8});
  else map.setView([56.7,-4.8],7);
  return map;
}

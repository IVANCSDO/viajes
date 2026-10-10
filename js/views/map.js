import {escapeHTML as e,icon} from '../utils.js';
import {pageHeading,mapLegend,statusBadge} from '../components.js';
import {createMap,clearMaps} from '../maps.js';
import {mountMapFullscreen} from '../map-fullscreen.js';
export function renderMap(data,params) {
  const selected = data.dayById.has(params.get('dia')) ? params.get('dia') : '';
  return `<div class="container page-content">${pageHeading('SIGUE EL CAMINO','Escocia, sobre el mapa.','De una costa a otra, entre islas y montañas. Explora el plan 2027, sus visitas acordadas y sus opciones provisionales.')}<div class="map-layout"><aside class="map-sidebar"><label for="map-day" class="eyebrow">EXPLORAR POR JORNADA</label><select id="map-day" class="form-select"><option value="">Todo el viaje</option>${data.days.map(day => `<option value="${e(day.id)}" ${selected === day.id ? 'selected' : ''}>Día ${day.number} · ${e(day.title)}</option>`).join('')}</select><div id="map-selection"></div><button id="fit-map" class="btn btn-outline-forest">${icon('arrows-fullscreen')} Centrar recorrido</button><p class="fine-print">Las líneas discontinuas unen destinos de forma orientativa. Aún no hay trazados de carretera verificados.</p></aside><div id="map-slot"><div class="full-map-card"><div class="map-toolbar"><button type="button" id="expand-map" class="btn btn-outline-forest" aria-controls="map-fullscreen" aria-expanded="false">${icon('arrows-fullscreen')} Pantalla completa</button></div><div id="trip-map" class="map full-map" role="region" aria-label="Mapa interactivo del viaje"></div>${mapLegend()}</div></div></div><dialog id="map-fullscreen" class="map-fullscreen" aria-label="Mapa del viaje a pantalla completa"></dialog></div>`;
}
export function mountMap(data) {
  const select = document.querySelector('#map-day');
  let map;
  function update() {
    clearMaps();
    const day = data.dayById.get(select.value);
    document.querySelector('#map-selection').innerHTML = day ? `<span class="small-label">DÍA ${day.number}</span><h2>${e(day.title)}</h2>${statusBadge(day.status)}<p>${e(day.subtitle)}</p><a class="text-link" href="#dia/${e(day.id)}">Ver jornada ${icon('arrow-right')}</a>` : `<span class="small-label">DE ${e(data.placeById.get(data.trip.arrivalPlaceId).name.toUpperCase())} A ${e(data.placeById.get(data.trip.departurePlaceId).name.toUpperCase())}</span><h2>Un viaje circular.</h2><p>${data.days.length} días · ${data.places.length} destinos previstos</p><div class="map-place-list" tabindex="0" role="region" aria-label="Lugares del viaje">${data.places.map(place => `<a href="#lugar/${e(place.id)}">${icon('geo-alt')} ${e(place.name)}</a>`).join('')}</div>`;
    map = createMap('trip-map',data,{dayId:select.value || null});
  }
  select.addEventListener('change',update);
  document.querySelector('#fit-map').addEventListener('click',update);
  update();
  return mountMapFullscreen(() => requestAnimationFrame(() => map?.invalidateSize({pan:false})));
}

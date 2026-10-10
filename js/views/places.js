import {escapeHTML as e,icon,categories,mapsUrl,externalLink,metricLabel} from '../utils.js';
import {pageHeading,placeCard,placeImage,favoriteButton,sourceLinks} from '../components.js';
import {favorites} from '../storage.js';
import {photoDetails} from '../images.js';
import {renderMiniGuide} from '../mini-guide.js';
import {createMap} from '../maps.js';
import {dayTouchesPlace,planLabels} from '../trip.js';
export function renderPlaces(data,params) {
  const saved = params.get('favoritos') === '1';
  return `<div class="container page-content">${pageHeading('UN MAPA LLENO DE POSIBILIDADES','Lugares para recordar.','Cada lugar tiene su mini free tour: qué es, qué ver, historias y curiosidades. Abre una ficha para descubrirlo y guarda tus favoritos.')}<div class="places-toolbar"><label class="search-field">${icon('search')}<span class="visually-hidden">Buscar un lugar</span><input id="place-search" type="search" placeholder="Buscar un lugar, una región…" autocomplete="off"></label><label class="favorites-toggle"><input type="checkbox" id="only-favorites" ${saved ? 'checked' : ''}> ${icon('bookmark')} Mis lugares</label></div><div class="filter-chips" role="group" aria-label="Filtrar por tipo"><button class="filter-chip active" data-category="all" aria-pressed="true">Todos</button>${Object.entries(categories).map(([key,label]) => `<button class="filter-chip" data-category="${key}" aria-pressed="false">${label}</button>`).join('')}</div><p id="result-count" class="result-count" role="status"></p><div class="places-grid" id="places-results"></div></div>`;
}
export function mountPlaces(data) {
  let category = 'all';
  const search = document.querySelector('#place-search');
  const savedOnly = document.querySelector('#only-favorites');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function update() {
    const query = normalize(search.value.trim());
    const saved = favorites();
    const places = data.places.filter(place => (category === 'all' || place.category === category) && (!savedOnly.checked || saved.includes(place.id)) && normalize(`${place.name} ${place.region} ${place.description}`).includes(query));
    document.querySelector('#result-count').textContent = `${places.length} ${places.length === 1 ? 'lugar para descubrir' : 'lugares para descubrir'}`;
    document.querySelector('#places-results').innerHTML = places.length ? places.map(place => placeCard(place,data)).join('') : `<div class="empty-state">${icon('compass')}<h2>Aún queda mucho por descubrir.</h2><p>${savedOnly.checked ? 'Guarda lugares con el icono del marcapáginas o desactiva «Mis lugares».' : 'Prueba otra búsqueda o selecciona «Todos».'}</p><button id="reset-filters" class="btn btn-forest">Ver todos los lugares</button></div>`;
    document.querySelector('#reset-filters')?.addEventListener('click', () => { search.value=''; savedOnly.checked=false; setCategory('all'); });
  }
  function setCategory(value) { category=value; document.querySelectorAll('[data-category]').forEach(button => { const active=button.dataset.category === value; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)); }); update(); }
  search.addEventListener('input',update);
  savedOnly.addEventListener('change',update);
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click',() => setCategory(button.dataset.category)));
  document.querySelector('#places-results').addEventListener('favoriteschange',() => {
    if (savedOnly.checked) { update(); (document.querySelector('#places-results [data-save]') || document.querySelector('#reset-filters'))?.focus(); }
  });
  update();
}
export function renderPlace(data,id) {
  const place = data.placeById.get(id);
  if (!place) return null;
  const days = data.days.filter(day => dayTouchesPlace(day,id,data));
  const guide = place.miniGuide ? renderMiniGuide(place,data) : `${place.history ? `<h2>Un poco de historia</h2><p>${e(place.history)}</p>` : ''}${place.geology ? `<h2>El paisaje tiene memoria</h2><p>${e(place.geology)}</p>` : ''}`;
  return `<div class="container page-content"><a class="back-link" href="#lugares">${icon('arrow-left')} Todos los lugares</a><div class="place-detail-header">${pageHeading(`${categories[place.category]} · ${place.region}`,place.name,place.description)}${favoriteButton(place)}</div><div class="detail-grid"><section><figure class="place-detail-photo">${placeImage(place,'',true)}<figcaption>${e(photoDetails(place).imageCaption)}</figcaption></figure>${guide}<h2>Antes de ir</h2><ul class="recommendations">${place.recommendations.map(text => `<li>${e(text)}</li>`).join('')}</ul><details class="sources-details"><summary>Fuentes de esta ficha</summary>${sourceLinks(place.sourceIds,data)}</details></section><aside><div class="place-info-card"><span class="eyebrow">EN NUESTRO VIAJE</span><h2>Hacemos una parada.</h2><p>${icon('clock')} Duración: ${metricLabel(place.durationMinutes,place.durationMinutesRange,'time')}${place.durationMinutesRange ? ' · Estimación inicial' : ''}</p><p>${icon('geo-alt')} ${e(place.region)}</p><div class="day-links">${days.map(day => `<a href="#dia/${e(day.id)}">Día ${day.number} · ${e(planLabels[day.status])} ${icon('arrow-right')}</a>`).join('')}</div>${externalLink(mapsUrl(place),'Abrir en Google Maps','btn btn-forest')}</div><div id="place-map" class="map place-map" role="region" aria-label="Localización de ${e(place.name)}"></div><p class="fine-print">Coordenadas aproximadas: ${place.coordinates.join(', ')}. No identifican necesariamente un acceso o aparcamiento.</p></aside></div></div>`;
}
export function mountPlace(data,id) { createMap('place-map',data,{placeId:id}); }

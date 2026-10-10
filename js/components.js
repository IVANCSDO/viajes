import {escapeHTML as e, icon, categories, dateLabel, metricLabel, externalLink} from './utils.js';
import {favorites} from './storage.js';
import {photoDetails} from './images.js';
import {planLabels,dayTouchesPlace,overnightLabel,modeLabels} from './trip.js';
export const statusBadge = (status = 'provisional') => `<span class="status-badge ${status === 'confirmada' ? 'confirmed' : status === 'planificada' ? 'planned' : ''}">${icon(status === 'confirmada' ? 'check2-circle' : 'circle')} ${e(planLabels[status] || 'Por confirmar')}</span>`;
export function stopBadge(stop) {
  const label = stop.priority === 'opcional' ? 'Opcional' : stop.status === 'acordada' ? 'Visita acordada' : stop.status === 'provisional' ? 'Visita provisional' : 'Visita propuesta';
  return `<span class="stop-badge ${stop.priority === 'opcional' ? 'optional' : stop.status === 'acordada' ? 'agreed' : 'provisional'}">${icon(stop.priority === 'opcional' ? 'plus-circle' : stop.status === 'acordada' ? 'check2-circle' : 'circle')} ${label}</span>`;
}
export function reservationBadge(status) { return `<span class="reservation-badge ${status === 'confirmada' ? 'booked' : ''}">${icon(status === 'confirmada' ? 'ticket-perforated-fill' : 'hourglass-split')} ${status === 'confirmada' ? 'Reserva confirmada' : 'Sin reserva confirmada'}</span>`; }
export function planLegend() { return `<div class="plan-legend" aria-label="Estados del viaje">${statusBadge('confirmada')}${statusBadge('provisional')}${stopBadge({priority:'opcional'})}${reservationBadge('pendiente')}<small>Un plan acordado no implica que exista una reserva.</small></div>`; }
export function pageHeading(kicker,title,text) { return `<header class="page-heading"><span class="eyebrow">${e(kicker)}</span><h1>${e(title)}</h1><p>${e(text)}</p></header>`; }
export function notice(text) { return `<div class="planning-note">${icon('info-circle')}<p>${e(text)}</p></div>`; }
export function favoriteButton(place) { const saved = favorites().includes(place.id); return `<button type="button" class="save-button ${saved ? 'is-saved' : ''}" data-save="${e(place.id)}" aria-pressed="${saved}" aria-label="${saved ? 'Quitar' : 'Guardar'} ${e(place.name)}">${icon(saved ? 'bookmark-fill' : 'bookmark')}</button>`; }
export function placeImage(place, className = '', eager = false) {
  const photo = photoDetails(place);
  return `<img class="${e(className)}" data-photo src="${e(photo.image)}" alt="${e(photo.imageAlt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" width="800" height="560">`;
}
export function placeCard(place,data) {
  const days = data.days.filter(day => dayTouchesPlace(day,place.id,data)).map(day => day.number);
  return `<article class="place-card"><div class="place-media"><a href="#lugar/${e(place.id)}" tabindex="-1" aria-hidden="true">${placeImage(place)}</a><span class="image-tag">${e(categories[place.category])}</span>${favoriteButton(place)}</div><div class="place-body"><span class="small-label">${e(place.region)}</span><h3><a href="#lugar/${e(place.id)}">${e(place.name)} ${icon('arrow-up-right')}</a></h3><p>${e(place.description)}</p><div class="card-bottom">${icon('signpost-split')} ${days.length ? `Día${days.length > 1 ? 's' : ''} ${days.join(', ')}` : 'Por organizar'}</div></div></article>`;
}
export function dayCard(day,data) {
  const place = data.placeById.get(day.destinationId);
  const photoPlace = data.placeById.get(day.imagePlaceId || day.destinationId);
  return `<a href="#dia/${e(day.id)}" class="day-card"><div class="day-image">${placeImage(photoPlace)}<span class="day-number">DÍA ${String(day.number).padStart(2,'0')}</span></div><div class="day-body"><span class="small-label">${day.tourismFree ? 'Solo regreso' : e(dateLabel(day.date))}</span><h3>${e(day.title)}</h3><p>${e(day.subtitle)}</p><span class="day-card-footer">${day.tourismFree ? `${icon('airplane')} Sin actividades turísticas` : `${icon('geo-alt')} ${e(place.name)}`} ${icon('arrow-right')}</span></div></a>`;
}
export function dayMetrics(day,data) { return `<div class="day-metrics"><div>${icon('signpost-2')}<span>${day.metricsStatus === 'estimada' ? 'Conducción estimada' : 'Distancia de conducción'}<strong>${metricLabel(day.distanceKm,day.distanceKmRange)}</strong></span></div><div>${icon('clock')}<span>${day.metricsStatus === 'estimada' ? 'Tiempo estimado · Sin ferry ni esperas' : 'Tiempo de conducción'}<strong>${metricLabel(day.drivingMinutes,day.drivingMinutesRange,'time')}</strong></span></div><div>${icon('moon')}<span>Pernocta<strong>${e(overnightLabel(day,data))}</strong></span></div></div>`; }
export const mapLegend = () => `<div class="map-legend"><span><b class="legend-line"></b>Autocaravana</span><span><b class="legend-line sea"></b>Ferry / barco</span><span><b class="legend-line public"></b>Autobús / tren</span><small>Conexiones esquemáticas, no rutas reales. Coordenadas aproximadas.</small></div>`;
export function accommodationCard(day,data) {
  const stay = data.accommodationById.get(day.overnightId);
  if (!stay) return `<div class="overnight-card">${icon('airplane')}<div><span class="small-label">FIN DEL VIAJE</span><h3>Regreso desde Glasgow</h3><p>Sin pernocta prevista después del vuelo.</p></div></div>`;
  const nights = data.days.filter(d => d.overnightId === stay.id);
  const nightIndex = nights.indexOf(day)+1;
  return `<div class="accommodation-card"><span class="eyebrow">${stay.type === 'convencional' ? 'ALOJAMIENTO CONVENCIONAL' : 'PERNOCTA EN AUTOCARAVANA'}</span><h3>${e(overnightLabel(day,data))}</h3><div class="booking-badges"><span class="selection-badge ${stay.selectionStatus === 'elegida' ? 'chosen' : ''}">${stay.selectionStatus === 'elegida' ? 'Camping elegido' : 'Alojamiento por elegir'}</span>${reservationBadge(stay.reservationStatus)}</div><p>${e(stay.note)}</p>${nights.length > 1 ? `<p class="fine-print">Noche ${nightIndex} de ${nights.length} previstas en esta base.</p>` : ''}${stay.url ? externalLink(stay.url,'Consultar web oficial','text-link') : ''}${stay.candidateIds.map(id => data.accommodationById.get(id)).map(candidate => `<div class="camping-candidate"><span class="selection-badge">Solo candidato</span><h4>${e(candidate.name)}</h4><p>${e(candidate.note)}</p>${externalLink(candidate.url,'Comprobar condiciones','text-link')}</div>`).join('')}</div>`;
}
export function travelLegs(day,data) {
  if (!day.travelLegs.length) return '';
  return `<section class="travel-legs"><h2>Cómo nos movemos</h2>${day.travelLegs.map(leg => `<article class="travel-leg"><span class="travel-mode">${icon(['ferry','boat'].includes(leg.mode) ? 'water' : leg.mode === 'public' ? 'train-front' : 'truck')} ${e(modeLabels[leg.mode])}</span><h3><a href="#lugar/${e(leg.originId)}">${e(data.placeById.get(leg.originId).name)}</a> ${icon('arrow-right')} <a href="#lugar/${e(leg.destinationId)}">${e(data.placeById.get(leg.destinationId).name)}</a></h3><p>${e(leg.note)}</p>${leg.serviceId ? reservationBadge(data.serviceById.get(leg.serviceId).reservationStatus) : ''}</article>`).join('')}</section>`;
}
export function sourceLinks(ids,data) { return `<ul class="source-links">${ids.map(id => data.sources.find(source => source.id === id)).filter(Boolean).map(source => `<li>${source.url ? `<a href="${e(source.url)}" target="_blank" rel="noopener noreferrer">${e(source.title)} ${icon('arrow-up-right')}</a>` : e(source.title)}</li>`).join('')}</ul>`; }
